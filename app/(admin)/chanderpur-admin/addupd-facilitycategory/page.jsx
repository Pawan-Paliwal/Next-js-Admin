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
import { useGetFacilityCategoryByIdQuery, useSaveOrUpdateFacilityCategoryMutation, useGetFacilityCategoryMaxDisplayOrderQuery } from "@/store/backendSlice/facilityCategoryAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdFacilityCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const CategoryID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: maxOrderData } = useGetFacilityCategoryMaxDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = CategoryID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${CategoryID ? 'edit' : 'add'} facility category`);
        router.push("/chanderpur-admin/manage-facilitycategory");
      }
    }
  }, [isPermissionsReady, pagePermission, CategoryID, router]);

  const { data: categoryData } = useGetFacilityCategoryByIdQuery(CategoryID, {
    skip: !CategoryID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateCategory, { isLoading }] = useSaveOrUpdateFacilityCategoryMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    CategoryName: "",
    CategoryNameURL: "",
    Tagline: "",
    SmallDescription: "",
    Description: "",
    CategoryImage: null,
    BannerImage: null,
    DisplayOrder: 0,
    ActiveStatus: true,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: ""
  });

  const [previewImage, setPreviewImage] = useState("");
  const [previewBanner, setPreviewBanner] = useState("");

  useEffect(() => {
    if (categoryData?.success) {
      const data = categoryData.data;
      setFormData({
        CategoryName: data.CategoryName || "",
        CategoryNameURL: data.CategoryNameURL || "",
        Tagline: data.Tagline || "",
        SmallDescription: data.SmallDescription || "",
        Description: data.Description || "",
        CategoryImage: null,
        BannerImage: null,
        DisplayOrder: data.DisplayOrder ?? 0,
        ActiveStatus: data.ActiveStatus === 1,
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || ""
      });
      setPreviewImage(data.CategoryImage ? `/OnlineImages/FacilitycategoryImages/${data.CategoryImage}` : "");
      setPreviewBanner(data.BannerImage ? `/OnlineImages/FacilitycategoryImages/${data.BannerImage}` : "");
    }
    else if (!CategoryID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [categoryData, maxOrderData, CategoryID]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.CategoryNameURL?.replace(/\s+/g, "-") || "category";
    const newName = `${slug}${nameSuffix}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    CategoryName: { required: true, requiredMessage: "Please enter category name." },
    CategoryImage: { required: !CategoryID, requiredMessage: "Please upload an image." },
    BannerImage: { required: !CategoryID, requiredMessage: "Please upload a banner image." },
  };

  const handleSubmit = async () => {
    const requiredPermission = CategoryID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${CategoryID ? 'edit' : 'add'} facility category`);
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
      if (key === "CategoryImage" && value instanceof File) {
        data.append("CategoryImage", handleFileRename(value, ""));
      } else if (key === "BannerImage" && value instanceof File) {
        data.append("BannerImage", handleFileRename(value, "-banner"));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });
    data.append("UpdatedBy", "Admin Panel");
    if (CategoryID) data.append("CategoryID", CategoryID);
    try {
      const res = await saveOrUpdateCategory(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-facilitycategory");
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
        <h1>Add/Update Facility Category</h1>

        {/* First Row: Name, URL, Tagline, Small Description */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", width: "100%" }}>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Category Name*</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g. Industrial"
              value={formData.CategoryName ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("CategoryName", val);
                if (!CategoryID) {
                  handleInput("CategoryNameURL", generateSlug(val));
                  handleInput("MetaTitle", `${val} | Chanderpur`);
                }
                setFormErrors(prev => ({ ...prev, CategoryName: "" }));
              }}
            />
            {formErrors.CategoryName && <p style={{ color: "red", fontSize: "12px", marginTop: "2px" }}>{formErrors.CategoryName}</p>}
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Name URL*</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={formData.CategoryNameURL ?? ""}
              onChange={(e) => handleInput("CategoryNameURL", e.target.value)}
            />
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Tagline</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Tagline here"
              value={formData.Tagline ?? ""}
              onChange={(e) => handleInput("Tagline", e.target.value)}
            />
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Small Description</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Brief summary"
              value={formData.SmallDescription ?? ""}
              onChange={(e) => handleInput("SmallDescription", e.target.value)}
            />
          </div>
        </div>

        {/* Second Row: Image Inputs (2 per row) with right side previews */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", width: "100%" }}>
          <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Category Image*</label>
              <input
                type="file"
                style={{ width: "100%" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("CategoryImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, CategoryImage: "" }));
                }}
              />
              {formErrors.CategoryImage && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.CategoryImage}</p>}
            </div>
            {previewImage && (
              <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={previewImage} alt="Preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
            )}
          </div>
          <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Banner Image*</label>
              <input
                type="file"
                style={{ width: "100%" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("BannerImage", file);
                    setPreviewBanner(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, BannerImage: "" }));
                }}
              />
              {formErrors.BannerImage && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.BannerImage}</p>}
            </div>
            {previewBanner && (
              <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={previewBanner} alt="Banner Preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
            )}
          </div>
        </div>

        {/* Full row for Description */}
        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Description</label>
          <div style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #ccc" }}>
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

        {/* Status and Display Order Row */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "center" }}>
          <div style={{ width: "150px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Display Order</label>
            <input
              type="number"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="0"
              value={formData.DisplayOrder ?? ""}
              onChange={(e) => handleInput("DisplayOrder", e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "22px" }}>
            <input
              type="checkbox"
              id="chkActiveStatus"
              style={{ width: "18px", height: "18px" }}
              checked={formData.ActiveStatus}
              onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus" style={{ fontWeight: "600", cursor: "pointer" }}>Status (Active/Inactive)</label>
          </div>
        </div>

        <h2>SEO Information</h2>
        <hr style={{ marginBottom: "20px" }} />
        <div className="form-group">
          <label className="block-label">Meta Title</label>
          <input type="text" value={formData.MetaTitle ?? ""} onChange={(e) => handleInput("MetaTitle", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Keywords</label>
          <input type="text" value={formData.MetaKeywords ?? ""} onChange={(e) => handleInput("MetaKeywords", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Descriptions</label>
          <input type="text" value={formData.MetaDescriptions ?? ""} onChange={(e) => handleInput("MetaDescriptions", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Schema</label>
          <input type="text" value={formData.MetaSchema ?? ""} onChange={(e) => handleInput("MetaSchema", e.target.value)} />
        </div>

        <div style={{ marginTop: "30px" }}>
          <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader />} Submit
          </button>
          <Link href="/chanderpur-admin/manage-facilitycategory" className="back-btn" style={{ marginLeft: "10px" }}>
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
