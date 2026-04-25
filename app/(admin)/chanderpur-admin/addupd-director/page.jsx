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
import { useGetDirectorByIdQuery, useSaveOrUpdateDirectorMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/directorAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdDirectorData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const DirectorID = searchParams.get("ID");
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

  const { data: directorData } = useGetDirectorByIdQuery(DirectorID, {
    skip: !DirectorID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateDirector, { isLoading }] = useSaveOrUpdateDirectorMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    DirectorName: "",
    DirectorDesignation: "",
    DirectorImage: null,
    DirectorBio: "",
    ActiveStatus: false,
    DisplayOrder: 0
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (directorData?.success) {
      const data = directorData.data;
      setFormData({
        DirectorName: data.DirectorName || "",
        DirectorDesignation: data.DirectorDesignation || "",
        DirectorImage: null,
        DirectorBio: data.DirectorBio || "",
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.DirectorImage) {
        setPreviewImage(`/OnlineImages/DirectorImages/${data.DirectorImage}`);
      } else {
        setPreviewImage(null);
      }
    }
    else if (!DirectorID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [directorData, maxOrderData]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.DirectorName?.replace(/[^a-z0-9\s-]/gi, "").trim().replace(/\s+/g, "-").toLowerCase() || "dir";
    const newName = `${slug}${nameSuffix}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    DirectorName: {
      required: true,
      requiredMessage: "Please enter a name."
    },
    DirectorDesignation: {
      required: true,
      requiredMessage: "Please enter a designation."
    },
    DirectorImage: {
      required: !DirectorID,
      requiredMessage: "Please upload an image."
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
      if (key === "DirectorImage" && value instanceof File) {
        data.append("DirectorImage", handleFileRename(value, ""));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });
    data.append("UpdatedBy", "Admin Panel");
    if (DirectorID) data.append("DirectorID", DirectorID);
    try {
      const res = await saveOrUpdateDirector(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-director");
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
        <h1>Add/Update Director</h1>

        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px", display: "flex", alignItems: "center" }}>
          <div className="form-group displayorder">
            <label>Director Name*</label>
            <input
              type="text"
              placeholder="Mr. Sudhir Chandra"
              value={formData.DirectorName}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("DirectorName", val);
                setFormErrors(prev => ({ ...prev, DirectorName: "" }));
              }}
            />
            {formErrors.DirectorName && <p className="error">{formErrors.DirectorName}</p>}
          </div>

          <div className="form-group displayorder">
            <label>Designation*</label>
            <input
              type="text"
              placeholder="Managing Director"
              value={formData.DirectorDesignation}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("DirectorDesignation", val);
                setFormErrors(prev => ({ ...prev, DirectorDesignation: "" }));
              }}
            />
            {formErrors.DirectorDesignation && <p className="error">{formErrors.DirectorDesignation}</p>}
          </div>

          <div className="colA">
            <div className="form-group">
              <label>Image*</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("DirectorImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, DirectorImage: "" }));
                }}
              />
              {formErrors.DirectorImage && <p className="error">{formErrors.DirectorImage}</p>}
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

        <div className="form-group" style={{ display: "none", width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px" }}>Biography*</label>
          <div style={{ width: "100%", backgroundColor: "#fff" }}>
            <SunEditor
              lang="en"
              name="DirectorBio"
              width="100%"
              height="200px"
              setContents={formData.DirectorBio || ""}
              onChange={(content) => {
                handleInput("DirectorBio", content);
                setFormErrors(prev => ({ ...prev, DirectorBio: "" }));
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
          {formErrors.DirectorBio && <p className="error">{formErrors.DirectorBio}</p>}
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/chanderpur-admin/manage-director" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}
