'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import nextDynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
const SunEditor = nextDynamic(() => import('suneditor-react'), { ssr: false });
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetMilestoneByIdQuery, useSaveOrUpdateMilestoneMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/milestoneAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdMilestoneData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const MilestoneID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: maxOrderData } = useGetMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = MilestoneID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${MilestoneID ? 'edit' : 'add'} milestone`);
        router.push("/chanderpur-admin/manage-milestone");
      }
    }
  }, [isPermissionsReady, pagePermission, MilestoneID, router]);

  const { data: milestoneData } = useGetMilestoneByIdQuery(MilestoneID, {
    skip: !MilestoneID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateMilestone, { isLoading }] = useSaveOrUpdateMilestoneMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    MilestoneName: "",
    MilestoneNameURL: "",
    MilestoneYear: "",
    MilestoneImage: null,
    Description: "",
    ActiveStatus: false,
    DisplayOrder: 0
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (milestoneData?.success) {
      const data = milestoneData.data;
      setFormData({
        MilestoneName: data.MilestoneName || "",
        MilestoneNameURL: data.MilestoneNameURL || "",
        MilestoneYear: data.MilestoneYear || "",
        MilestoneImage: null,
        Description: data.Description || "",
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.MilestoneImage) setPreviewImage(`/OnlineImages/MilestoneImages/${data.MilestoneImage}`);
      else setPreviewImage(null);
    }
    else if (!MilestoneID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({ ...prev, DisplayOrder: maxOrderData.maxOrder + 1 }));
    }
  }, [milestoneData, maxOrderData]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file) => {
    const ext = file.name.split(".").pop();
    const slug = formData.MilestoneNameURL?.replace(/\s+/g, "-") || "milestone";
    const newName = `${slug}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    MilestoneName: { required: true, requiredMessage: "Please enter a name." },
    MilestoneYear: { required: true, requiredMessage: "Please enter a year." },
    MilestoneImage: { required: !MilestoneID, requiredMessage: "Please upload an image." },
  };

  const handleSubmit = async () => {
    const requiredPermission = MilestoneID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${MilestoneID ? 'edit' : 'add'} milestone`);
      return;
    }

    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "MilestoneImage" && value instanceof File) {
        data.append("MilestoneImage", handleFileRename(value));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });

    data.append("UpdatedBy", "Admin Panel");
    if (MilestoneID) data.append("MilestoneID", MilestoneID);

    try {
      const res = await saveOrUpdateMilestone(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-milestone");
      } else {
        toast.error(res.message || "Save failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    }
  };

  const editorOptions = {
    buttonList: [
      ['undo', 'redo'],
      ['font', 'fontSize', 'formatBlock'],
      ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
      ['removeFormat'], '/',
      ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
      ['link', 'image', 'video'],
      ['fullScreen', 'showBlocks', 'codeView'],
      ['preview', 'print']
    ],
    minHeight: "200px"
  };

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>Add/Update Milestone</h1>
        
        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="form-group displayorder">
            <label>Title*</label>
            <input
              type="text"
              placeholder="e.g. Started new facility"
              value={formData.MilestoneName ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("MilestoneName", val);
                if (!MilestoneID) handleInput("MilestoneNameURL", generateSlug(val));
                setFormErrors(prev => ({ ...prev, MilestoneName: "" }));
              }}
            />
            {formErrors.MilestoneName && <p className="error">{formErrors.MilestoneName}</p>}
          </div>

          <div className="form-group displayorder">
            <label>Year*</label>
            <input
              type="text"
              placeholder="e.g. 1999"
              value={formData.MilestoneYear ?? ""}
              onChange={(e) => {
                handleInput("MilestoneYear", e.target.value);
                setFormErrors(prev => ({ ...prev, MilestoneYear: "" }));
              }}
            />
            {formErrors.MilestoneYear && <p className="error">{formErrors.MilestoneYear}</p>}
          </div>

          <div className="form-group" style={{ display: "none" }}>
            <label>Name URL*</label>
            <input type="text" value={formData.MilestoneNameURL ?? ""} onChange={(e) => handleInput("MilestoneNameURL", e.target.value)} />
          </div>

          <div className="colA">
            <div className="form-group">
              <label>Milestone Image*</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("MilestoneImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, MilestoneImage: "" }));
                }}
              />
              {formErrors.MilestoneImage && <p className="error">{formErrors.MilestoneImage}</p>}
            </div>
          </div>
          {previewImage && (
            <div className="image-preview"><img src={previewImage} alt="Preview" height={50} /></div>
          )}
        </div>

        <div className="form-group" style={{ display: "block", width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px" }}>Description</label>
          <div style={{ width: "100%", backgroundColor: "#fff" }}>
            <SunEditor
              lang="en"
              name="Description"
              width="100%"
              height="200px"
              setContents={formData.Description || ""}
              onChange={(content) => handleInput("Description", content)}
              setOptions={editorOptions}
            />
          </div>
        </div>

        <div className="form-group-row" style={{ marginTop: "20px" }}>
          <div className="form-group displayorder">
            <label>Display Order</label>
            <input
              type="number"
              placeholder="0"
              value={formData.DisplayOrder ?? ""}
              onChange={(e) =>
                handleInput("DisplayOrder", e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
          <div className="form-group-row statusac">
            <input type="checkbox" id="chkActiveStatus" checked={formData.ActiveStatus} onChange={(e) => handleInput("ActiveStatus", e.target.checked)} />
            <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/chanderpur-admin/manage-milestone" className="back-btn">Back</Link>
      </div>
    </main>
  );
}
