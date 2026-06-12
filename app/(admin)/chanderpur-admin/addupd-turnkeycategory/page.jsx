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
import { useGetClientTypeByIdQuery, useSaveOrUpdateClientTypeMutation, useGetClientTypeMaxDisplayOrderQuery } from "@/store/backendSlice/clientTypeAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdClientType() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ClientTypeID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: maxOrderData } = useGetClientTypeMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: typeData } = useGetClientTypeByIdQuery(ClientTypeID, { skip: !ClientTypeID, refetchOnMountOrArgChange: true });
  const [saveOrUpdate, { isLoading }] = useSaveOrUpdateClientTypeMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    TypeName: "",
    TypeNameURL: "",
    SmallDescription: "",
    Heading: "",
    ListHeading: "",
    Description: "",
    ListDescription: "",
    ProductDescription: "",
    BannerImage: null,
    Image1: null,
    Image2: null,
    Image3: null,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "",
    ActiveStatus: true,
    DisplayOrder: 1,
  });

  const [previews, setPreviews] = useState({
    banner: "",
    image1: "",
    image2: "",
    image3: "",
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = ClientTypeID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${ClientTypeID ? 'edit' : 'add'} client type`);
        router.push("/chanderpur-admin/manage-turnkeycategory");
      }
    }
  }, [isPermissionsReady, pagePermission, ClientTypeID, router]);

  useEffect(() => {
    if (typeData?.success) {
      const d = typeData.data;
      setFormData({
        TypeName: d.TypeName || "",
        TypeNameURL: d.TypeNameURL || "",
        SmallDescription: d.SmallDescription || "",
        Heading: d.Heading || "",
        ListHeading: d.ListHeading || "",
        Description: d.Description || "",
        ListDescription: d.ListDescription || "",
        ProductDescription: d.ProductDescription || "",
        BannerImage: null,
        Image1: null,
        Image2: null,
        Image3: null,
        MetaTitle: d.MetaTitle || "",
        MetaKeywords: d.MetaKeywords || "",
        MetaDescriptions: d.MetaDescriptions || "",
        MetaSchema: d.MetaSchema || "",
        ActiveStatus: d.ActiveStatus === 1,
        DisplayOrder: d.DisplayOrder ?? 1,
      });
      setPreviews({
        banner: d.BannerImage ? `/OnlineImages/ClientTypeImages/${d.BannerImage}` : "",
        image1: d.Image1 ? `/OnlineImages/ClientTypeImages/${d.Image1}` : "",
        image2: d.Image2 ? `/OnlineImages/ClientTypeImages/${d.Image2}` : "",
        image3: d.Image3 ? `/OnlineImages/ClientTypeImages/${d.Image3}` : "",
      });
    } else if (!ClientTypeID && maxOrderData?.maxOrder !== undefined) {
      setFormData(prev => ({ ...prev, DisplayOrder: maxOrderData.maxOrder + 1 }));
    }
  }, [typeData, maxOrderData, ClientTypeID]);

  const handleInput = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file, previewKey) => {
    handleInput(field, file);
    if (file) setPreviews(prev => ({ ...prev, [previewKey]: URL.createObjectURL(file) }));
    setFormErrors(prev => ({ ...prev, [field]: "" }));
  };

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, suffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.TypeNameURL?.replace(/\s+/g, "-") || "clienttype";
    return new File([file], `${slug}${suffix}.${ext}`, { type: file.type });
  };

  const validationRules = {
    TypeName: { required: true, requiredMessage: "Please enter type name." },
    BannerImage: { required: !ClientTypeID, requiredMessage: "Please upload banner image." },
  };

  const handleSubmit = async () => {
    const requiredPermission = ClientTypeID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) { toast.error("No permission"); return; }

    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormErrors({});

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof File) {
        const suffixMap = { BannerImage: "-banner", Image1: "_1", Image2: "_2", Image3: "_3" };
        data.append(key, handleFileRename(value, suffixMap[key] || ""));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });
    data.append("UpdatedBy", "Admin Panel");
    if (ClientTypeID) data.append("ClientTypeID", ClientTypeID);

    try {
      const res = await saveOrUpdate(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-turnkeycategory");
      } else {
        toast.error(res.message || "Process failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{ClientTypeID ? "Update" : "Add"} Turnkey Category</h1>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: "2" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Name / Title*</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g. Corporate"
              value={formData.TypeName}
              onChange={e => {
                handleInput("TypeName", e.target.value);
                if (!ClientTypeID) {
                  handleInput("TypeNameURL", generateSlug(e.target.value));
                  handleInput("MetaTitle", `${e.target.value} | Chanderpur`);
                }
                setFormErrors(prev => ({ ...prev, TypeName: "" }));
              }}
            />
            {formErrors.TypeName && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.TypeName}</p>}
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Name URL</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g. corporate"
              value={formData.TypeNameURL}
              onChange={e => handleInput("TypeNameURL", e.target.value)}
            />
          </div>
          <div style={{ flex: "3" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Small Description</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Short description"
              value={formData.SmallDescription}
              onChange={e => handleInput("SmallDescription", e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>
                Banner Image{!ClientTypeID && "*"}
              </label>
              <input
                type="file"
                accept="image/*"
                style={{ width: "100%" }}
                onChange={e => handleFileChange("BannerImage", e.target.files[0], "banner")}
              />
              {formErrors.BannerImage && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.BannerImage}</p>}
            </div>
            {previews.banner && (
              <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src={previews.banner} alt="Banner" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
            )}
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Heading</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g. Section heading"
              value={formData.Heading}
              onChange={e => handleInput("Heading", e.target.value)}
            />
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>List Heading</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g. List heading"
              value={formData.ListHeading}
              onChange={e => handleInput("ListHeading", e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {[
            { field: "Image1", previewKey: "image1", label: "Image 1" },
            { field: "Image2", previewKey: "image2", label: "Image 2" },
            { field: "Image3", previewKey: "image3", label: "Image 3" },
          ].map(({ field, previewKey, label }) => (
            <div key={field} style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ flex: "1" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>{label}</label>
                <input
                  type="file"
                  accept="image/*"
                  style={{ width: "100%" }}
                  onChange={e => handleFileChange(field, e.target.files[0], previewKey)}
                />
              </div>
              {previews[previewKey] && (
                <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <img src={previews[previewKey]} alt={label} style={{ maxWidth: "100%", maxHeight: "100%" }} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>List Description</label>
          <div style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #ccc" }}>
            <SunEditor lang="en" name="ListDescription" width="100%" height="100px"
              setContents={formData.ListDescription || ""}
              onChange={content => handleInput("ListDescription", content)}
            />
          </div>
        </div>

        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Description</label>
          <div style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #ccc" }}>
            <SunEditor lang="en" name="Description" width="100%" height="100px"
              setContents={formData.Description || ""}
              onChange={content => handleInput("Description", content)}
            />
          </div>
        </div>

        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Product Description</label>
          <div style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #ccc" }}>
            <SunEditor lang="en" name="ProductDescription" width="100%" height="100px"
              setContents={formData.ProductDescription || ""}
              onChange={content => handleInput("ProductDescription", content)}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", alignItems: "center" }}>
          <div style={{ width: "150px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Display Order</label>
            <input
              type="number"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="0"
              value={formData.DisplayOrder ?? ""}
              onChange={e => handleInput("DisplayOrder", e.target.value === "" ? "" : Number(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "22px" }}>
            <input
              type="checkbox"
              id="chkActiveStatus"
              style={{ width: "18px", height: "18px" }}
              checked={formData.ActiveStatus}
              onChange={e => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus" style={{ fontWeight: "600", cursor: "pointer" }}>
              Status (Active/Inactive)
            </label>
          </div>
        </div>

        <h2 style={{marginTop:"22px"}}>SEO Information</h2>
        <hr />
        <div className="form-group">
          <label className="block-label">Meta Title</label>
          <input type="text" value={formData.MetaTitle ?? ""} onChange={e => handleInput("MetaTitle", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Keywords</label>
          <input type="text" value={formData.MetaKeywords ?? ""} onChange={e => handleInput("MetaKeywords", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Descriptions</label>
          <input type="text" value={formData.MetaDescriptions ?? ""} onChange={e => handleInput("MetaDescriptions", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="block-label">Meta Schema</label>
          <input type="text" value={formData.MetaSchema ?? ""} onChange={e => handleInput("MetaSchema", e.target.value)} />
        </div>

        <div style={{ marginTop: "30px" }}>
          <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader />} Submit
          </button>
          <Link href="/chanderpur-admin/manage-turnkeycategory" className="back-btn" style={{ marginLeft: "10px" }}>
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}