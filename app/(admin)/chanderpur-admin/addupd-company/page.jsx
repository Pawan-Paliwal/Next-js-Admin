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
import { useGetCompanyByIdQuery, useSaveOrUpdateCompanyMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/companyAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdCompanyData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const CompanyID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: maxOrderData } = useGetMaxDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = CompanyID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${CompanyID ? 'edit' : 'add'} company`);
        router.push("/chanderpur-admin/manage-company");
      }
    }
  }, [isPermissionsReady, pagePermission, CompanyID, router]);

  const { data: companyData } = useGetCompanyByIdQuery(CompanyID, {
    skip: !CompanyID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateCompany, { isLoading }] = useSaveOrUpdateCompanyMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    CompanyName: "",
    CompanyNameURL: "",
    CompanyImage: null,
    CompanyBannerImage: null,
    SmallDescription: "",
    Tagline: "",
    Description: "",
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "",
    ActiveStatus: false,
    DisplayOrder: 0
  });

  const [previewImage, setPreviewImage] = useState("");
  const [previewBanner, setPreviewBanner] = useState("");

  useEffect(() => {
    if (companyData?.success) {
      const data = companyData.data;
      setFormData({
        CompanyName: data.CompanyName || "",
        CompanyNameURL: data.CompanyNameURL || "",
        CompanyImage: null,
        CompanyBannerImage: null,
        SmallDescription: data.SmallDescription || "",
        Tagline: data.Tagline || "",
        Description: data.Description || "",
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || "",
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.CompanyImage) setPreviewImage(`/OnlineImages/CompanyImages/${data.CompanyImage}`);
      else setPreviewImage(null);
      if (data.CompanyBannerImage) setPreviewBanner(`/OnlineImages/CompanyImages/${data.CompanyBannerImage}`);
      else setPreviewBanner(null);
    }
    else if (!CompanyID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({ ...prev, DisplayOrder: maxOrderData.maxOrder + 1 }));
    }
  }, [companyData, maxOrderData]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.CompanyNameURL?.replace(/\s+/g, "-") || "company";
    const newName = `${slug}${nameSuffix}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    CompanyName: { required: true, requiredMessage: "Please enter a name." },
    CompanyImage: { required: !CompanyID, requiredMessage: "Please upload an image." },
  };

  const handleSubmit = async () => {
    const requiredPermission = CompanyID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${CompanyID ? 'edit' : 'add'} company`);
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
      if (key === "CompanyImage" && value instanceof File) {
        data.append("CompanyImage", handleFileRename(value, ""));
      } else if (key === "CompanyBannerImage" && value instanceof File) {
        data.append("CompanyBannerImage", handleFileRename(value, "-banner"));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });

    data.append("UpdatedBy", "Admin Panel");
    if (CompanyID) data.append("CompanyID", CompanyID);

    try {
      const res = await saveOrUpdateCompany(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-company");
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
        <h1>Add/Update Company</h1>

        <div className="form-group-row">
          <div className="form-group ">
            <label>Company Name*</label>
            <input
              type="text"
              placeholder="e.g. Christian Pfeiffer"
              value={formData.CompanyName ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("CompanyName", val);
                if (!CompanyID) {
                  handleInput("CompanyNameURL", generateSlug(val));
                  handleInput("MetaTitle", `${val} | Chanderpur`);
                }
                setFormErrors(prev => ({ ...prev, CompanyName: "" }));
              }}
            />
            {formErrors.CompanyName && <p className="error">{formErrors.CompanyName}</p>}
          </div>

          <div className="form-group ">
            <label>Tagline</label>
            <input
              type="text"
              placeholder="Enter tagline"
              value={formData.Tagline ?? ""}
              onChange={(e) => handleInput("Tagline", e.target.value)}
            />
          </div>

          <div className="form-group ">
            <label>Small Description</label>
            <input
              type="text"
              placeholder="Short introductory text..."
              value={formData.SmallDescription ?? ""}
              onChange={(e) => handleInput("SmallDescription", e.target.value)}
            />
          </div>
        </div>

        <div className="form-group" style={{ display: "none" }}>
          <label>Name URL*</label>
          <input type="text" value={formData.CompanyNameURL ?? ""} onChange={(e) => handleInput("CompanyNameURL", e.target.value)} />
        </div>

        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="colA" style={{ width: "43%" }}>
            <div className="form-group">
              <label>Company Image*</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("CompanyImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, CompanyImage: "" }));
                }}
              />
              {formErrors.CompanyImage && <p className="error">{formErrors.CompanyImage}</p>}
            </div>
          </div>
          {previewImage && (
            <div className="image-preview"><img src={previewImage} alt="Preview" height={50} /></div>
          )}

          <div className="colA" style={{ width: "43%" }}>
            <div className="form-group">
              <label>Banner Image</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("CompanyBannerImage", file);
                    setPreviewBanner(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>
          {previewBanner && (
            <div className="image-preview"><img src={previewBanner} alt="Banner Preview" height={50} /></div>
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

        <div className="form-group-row" style={{ marginTop: "20px", marginBottom: "20px" }}>
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
          <div className="form-group-row statusac mt-3 mb-4">
            <input type="checkbox" id="chkActiveStatus" checked={formData.ActiveStatus} onChange={(e) => handleInput("ActiveStatus", e.target.checked)} />
            <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
          </div>
        </div>

        <h2>SEO Information</h2>
        <hr />
        <div className="form-group">
          <label className="block-label">Meta Title</label>
          <input
            type="text"
            value={formData.MetaTitle ?? ""}
            onChange={(e) => handleInput("MetaTitle", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Keywords</label>
          <input
            type="text"
            value={formData.MetaKeywords ?? ""}
            onChange={(e) => handleInput("MetaKeywords", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Descriptions</label>
          <input
            type="text"
            value={formData.MetaDescriptions ?? ""}
            onChange={(e) => handleInput("MetaDescriptions", e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Schema</label>
          <input
            type="text"
            value={formData.MetaSchema ?? ""}
            onChange={(e) => handleInput("MetaSchema", e.target.value)}
          />
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/chanderpur-admin/manage-company" className="back-btn">Back</Link>
      </div>
    </main>
  );
}
