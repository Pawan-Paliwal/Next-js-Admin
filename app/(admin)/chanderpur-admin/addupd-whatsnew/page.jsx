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
import { useGetWhatsNewByIdQuery, useSaveOrUpdateWhatsNewMutation, useGetWhatsNewMaxDisplayOrderQuery } from "@/store/backendSlice/whatsNewAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdWhatsNewData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const WhatsNewID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: maxOrderData } = useGetWhatsNewMaxDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = WhatsNewID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${WhatsNewID ? 'edit' : 'add'} whats new content`);
        router.push("/chanderpur-admin/manage-whatsnew");
      }
    }
  }, [isPermissionsReady, pagePermission, WhatsNewID, router]);

  const { data: itemData } = useGetWhatsNewByIdQuery(WhatsNewID, {
    skip: !WhatsNewID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateItem, { isLoading }] = useSaveOrUpdateWhatsNewMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    WhatsNewName: "",
    WhatsNewNameURL: "",
    WhatsNewImage: null,
    Tagline: "",
    Description: "",
    ActiveStatus: true,
    DisplayOrder: 0
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (itemData?.success) {
      const data = itemData.data;
      setFormData({
        WhatsNewName: data.WhatsNewName || "",
        WhatsNewNameURL: data.WhatsNewNameURL || "",
        WhatsNewImage: null,
        Tagline: data.Tagline || "",
        Description: data.Description || "",
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.WhatsNewImage) {
        setPreviewImage(`/OnlineImages/WhatsnewImages/${data.WhatsNewImage}`);
      } else {
        setPreviewImage(null);
      }
    }
    else if (!WhatsNewID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [itemData, maxOrderData, WhatsNewID]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.WhatsNewNameURL?.replace(/\s+/g, "-") || "whatsnew";
    const newName = `${slug}${nameSuffix}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    WhatsNewName: { required: true, requiredMessage: "Please enter a name." },
    WhatsNewImage: { required: !WhatsNewID, requiredMessage: "Please upload an image." },
    Tagline: { required: true, requiredMessage: "Please enter a tagline." },
    Description: { required: true, requiredMessage: "Please enter a description." }
  };


  const handleSubmit = async () => {
    const requiredPermission = WhatsNewID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${WhatsNewID ? 'edit' : 'add'} whats new content`);
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
      if (key === "WhatsNewImage" && value instanceof File) {
        data.append("WhatsNewImage", handleFileRename(value, ""));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });
    data.append("UpdatedBy", "Admin Panel");
    if (WhatsNewID) data.append("WhatsNewID", WhatsNewID);
    try {
      const res = await saveOrUpdateItem(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-whatsnew");
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
        <h1>Add/Update Whats New</h1>
        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "15px" }}>
          <div className="form-group" style={{ flex: "1" }}>
            <label>Name*</label>
            <input
              type="text"
              placeholder="e.g. New Product Launch"
              value={formData.WhatsNewName ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("WhatsNewName", val);
                if (!WhatsNewID) {
                  handleInput("WhatsNewNameURL", generateSlug(val));
                }
                setFormErrors(prev => ({ ...prev, WhatsNewName: "" }));
              }}
            />
            {formErrors.WhatsNewName && <p className="error">{formErrors.WhatsNewName}</p>}
          </div>

          <div className="form-group" style={{ flex: "1" }}>
            <label>Tagline*</label>
            <input
              type="text"
              placeholder="e.g. Innovation in Action"
              value={formData.Tagline ?? ""}
              onChange={(e) => {
                handleInput("Tagline", e.target.value);
                setFormErrors(prev => ({ ...prev, Tagline: "" }));
              }}
            />
            {formErrors.Tagline && <p className="error">{formErrors.Tagline}</p>}
          </div>

          <div className="colA" style={{ flex: "1" }}>
            <div className="form-group">
              <label>Image*</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("WhatsNewImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, WhatsNewImage: "" }));
                }}
              />
              {formErrors.WhatsNewImage && <p className="error">{formErrors.WhatsNewImage}</p>}
            </div>
          </div>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" height={50} />
            </div>
          )}
          <div className="form-group" style={{ display: "none" }}>
            <label>Name URL*</label>
            <input
              type="text"
              value={formData.WhatsNewNameURL ?? ""}
              onChange={(e) => handleInput("WhatsNewNameURL", e.target.value)}
            />
          </div>
        </div>
        <div className="form-group-row">
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
        <Link href="/chanderpur-admin/manage-whatsnew" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}
