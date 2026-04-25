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
import { useGetCollaborationByIdQuery, useSaveOrUpdateCollaborationMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/collaborationAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdCollaborationData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const CollaborationID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery();
  const pagePermission = usePagePermission(checkData);
  const { data: maxOrderData } = useGetMaxDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (checkData?.loggedIn && pagePermission && pagePermission.CanWrite !== 1) {
      toast.error("You do not have permission to access this page");
      router.push("/chanderpur-admin/dashboard");
    }
  }, [checkData, pagePermission, router]);

  const { data: collaborationData } = useGetCollaborationByIdQuery(CollaborationID, {
    skip: !CollaborationID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateCollaboration, { isLoading }] = useSaveOrUpdateCollaborationMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    CollaborationName: "",
    CollaborationNameURL: "",
    CollaborationImage: null,
    Description: "",
    ActiveStatus: false,
    DisplayOrder: 0
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (collaborationData?.success) {
      const data = collaborationData.data;
      setFormData({
        CollaborationName: data.CollaborationName || "",
        CollaborationNameURL: data.CollaborationNameURL || "",
        CollaborationImage: null,
        Description: data.Description || "",
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.CollaborationImage) {
        setPreviewImage(`/OnlineImages/CollaborationImages/${data.CollaborationImage}`);
      } else {
        setPreviewImage(null);
      }
    }
    else if (!CollaborationID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [collaborationData, maxOrderData]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.CollaborationNameURL?.replace(/\s+/g, "-") || "collab";
    const newName = `${slug}${nameSuffix}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    CollaborationName: {
      required: true,
      requiredMessage: "Please enter a name."
    },
    CollaborationImage: {
      required: !CollaborationID,
      requiredMessage: "Please upload an image."
    },
    Description: {
      required: true,
      requiredMessage: "Please enter a description."
    }
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "CollaborationImage" && value instanceof File) {
        data.append("CollaborationImage", handleFileRename(value, ""));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });

    data.append("UpdatedBy", "Admin Panel");
    if (CollaborationID) data.append("CollaborationID", CollaborationID);

    try {
      const res = await saveOrUpdateCollaboration(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-collaboration");
      } else {
        toast.error(res.message || "Save failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>Add/Update Collaboration</h1>
        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px", display: "flex", alignItems: "center" }}>
          <div className="form-group displayorder">
            <label>Name*</label>
            <input
              type="text"
              placeholder="2010: Joint Venture with Christian Pfeiffer, Germany"
              value={formData.CollaborationName}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("CollaborationName", val);
                if (!CollaborationID) {
                  handleInput("CollaborationNameURL", generateSlug(val));
                }
                setFormErrors(prev => ({ ...prev, CollaborationName: "" }));
              }}
            />
            {formErrors.CollaborationName && <p className="error">{formErrors.CollaborationName}</p>}
          </div>
          <div className="form-group" style={{ display: "none" }}>
            <label>Name URL*</label>
            <input
              type="text"
              value={formData.CollaborationNameURL}
              onChange={(e) => handleInput("CollaborationNameURL", e.target.value)}
            />
          </div>
          <div className="colA">
            <div className="form-group">
              <label>Image*</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("CollaborationImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, CollaborationImage: "" }));
                }}
              />
              {formErrors.CollaborationImage && <p className="error">{formErrors.CollaborationImage}</p>}
            </div>
          </div>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" height={50} />
            </div>
          )}
        </div>

        <div className="form-group-row">
          <div className="form-group displayorder">
            <label>Display Order</label>
            <input
              type="number"
              placeholder="0"
              value={formData.DisplayOrder || ""}
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

        <div className="form-group" style={{ display: "block", width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px" }}>Description*</label>
          <div style={{ width: "100%", backgroundColor: "#fff" }}>
            <SunEditor
              lang="en"
              name="Description"
              width="100%"
              height="200px"
              setContents={formData.Description || ""}
              onChange={(content) => {
                handleInput("Description", content);
                setFormErrors(prev => ({ ...prev, Description: "" }));
              }}
              setOptions={{
                buttonList: [
                  ['undo', 'redo'],
                  ['font', 'fontSize', 'formatBlock'],
                  ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
                  ['removeFormat'],
                  '/',
                  ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
                  ['link', 'image', 'video'],
                  ['fullScreen', 'showBlocks', 'codeView'],
                  ['preview', 'print']
                ],
                minHeight: "200px"
              }}
            />
          </div>
          {formErrors.Description && <p className="error">{formErrors.Description}</p>}
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/chanderpur-admin/manage-collaboration" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}
