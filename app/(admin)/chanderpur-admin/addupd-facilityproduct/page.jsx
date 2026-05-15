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
import { useGetFacilityProductByIdQuery, useSaveOrUpdateFacilityProductMutation, useGetFacilityProductMaxDisplayOrderQuery } from "@/store/backendSlice/facilityProductAPISlice";
import { useGetAllFacilityCategoriesQuery } from "@/store/backendSlice/facilityCategoryAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdFacilityProduct() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ProductID = searchParams.get("ID");
  const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: categoriesData } = useGetAllFacilityCategoriesQuery();
  const { data: maxOrderData } = useGetFacilityProductMaxDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/chanderpur-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = ProductID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${ProductID ? 'edit' : 'add'} facility product`);
        router.push("/chanderpur-admin/manage-facilityproduct");
      }
    }
  }, [isPermissionsReady, pagePermission, ProductID, router]);

  const { data: productData } = useGetFacilityProductByIdQuery(ProductID, {
    skip: !ProductID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateProduct, { isLoading }] = useSaveOrUpdateFacilityProductMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    CategoryID: "",
    ProductName: "",
    ProductNameURL: "",
    FacilityDefaultImage: null,
    FacilityOtherImage1: null,
    FacilityOtherImage2: null,
    FacilityOtherImage3: null,
    Description: "",
    ActiveStatus: true,
    DisplayOrder: 0
  });

  const [previews, setPreviews] = useState({
    default: "",
    other1: "",
    other2: "",
    other3: ""
  });

  useEffect(() => {
    if (productData?.success) {
      const data = productData.data;
      setFormData({
        CategoryID: data.CategoryID || "",
        ProductName: data.ProductName || "",
        ProductNameURL: data.ProductNameURL || "",
        FacilityDefaultImage: null,
        FacilityOtherImage1: null,
        FacilityOtherImage2: null,
        FacilityOtherImage3: null,
        Description: data.Description || "",
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      setPreviews({
        default: data.FacilityDefaultImage ? `/OnlineImages/FacilityproductImages/${data.FacilityDefaultImage}` : "",
        other1: data.FacilityOtherImage1 ? `/OnlineImages/FacilityproductImages/${data.FacilityOtherImage1}` : "",
        other2: data.FacilityOtherImage2 ? `/OnlineImages/FacilityproductImages/${data.FacilityOtherImage2}` : "",
        other3: data.FacilityOtherImage3 ? `/OnlineImages/FacilityproductImages/${data.FacilityOtherImage3}` : ""
      });
    }
    else if (!ProductID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [productData, maxOrderData]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field, file, previewKey) => {
    handleInput(field, file);
    if (file) {
      setPreviews(prev => ({ ...prev, [previewKey]: URL.createObjectURL(file) }));
    }
    setFormErrors(prev => ({ ...prev, [field]: "" }));
  };

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.ProductNameURL?.replace(/\s+/g, "-") || "product";
    const newName = `${slug}${nameSuffix}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    CategoryID: { required: true, requiredMessage: "Please select a category." },
    ProductName: { required: true, requiredMessage: "Please enter product name." },
    FacilityDefaultImage: { required: !ProductID, requiredMessage: "Please upload default image." },
  };

  const handleSubmit = async () => {
    const requiredPermission = ProductID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${ProductID ? 'edit' : 'add'} facility product`);
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
      if (value instanceof File) {
        let suffix = "";
        if (key === "FacilityOtherImage1") suffix = "_1";
        if (key === "FacilityOtherImage2") suffix = "_2";
        if (key === "FacilityOtherImage3") suffix = "_3";
        data.append(key, handleFileRename(value, suffix));
      } else if (key === "ActiveStatus") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });
    data.append("UpdatedBy", "Admin Panel");
    if (ProductID) data.append("ProductID", ProductID);
    try {
      const res = await saveOrUpdateProduct(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-facilityproduct");
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
        <h1>Add/Update Facility Product</h1>

        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Category*</label>
            <select
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              value={formData.CategoryID}
              onChange={(e) => handleInput("CategoryID", e.target.value)}
            >
              <option value="">Select Category</option>
              {categoriesData?.map(cat => (
                <option key={cat.CategoryID} value={cat.CategoryID}>{cat.CategoryName}</option>
              ))}
            </select>
            {formErrors.CategoryID && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.CategoryID}</p>}
          </div>
          <div style={{ flex: "2" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Product Name*</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="e.g. Heavy Duty Crusher"
              value={formData.ProductName ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("ProductName", val);
                if (!ProductID) {
                  handleInput("ProductNameURL", generateSlug(val));
                }
                setFormErrors(prev => ({ ...prev, ProductName: "" }));
              }}
            />
            {formErrors.ProductName && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.ProductName}</p>}
          </div>
          <div style={{ flex: "1" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Name URL*</label>
            <input
              type="text"
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="duty-crusher"
              value={formData.ProductNameURL ?? ""}
              onChange={(e) => handleInput("ProductNameURL", e.target.value)}
            />
          </div>
        </div>

        {/* Row 1 for Images: Default + Other 1 */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Default Image*</label>
              <input type="file" style={{ width: "100%" }} onChange={(e) => handleFileChange("FacilityDefaultImage", e.target.files[0], "default")} />
              {formErrors.FacilityDefaultImage && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.FacilityDefaultImage}</p>}
            </div>
            {previews.default && (
              <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={previews.default} alt="Default" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
            )}
          </div>
          <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Other Image 1</label>
              <input type="file" style={{ width: "100%" }} onChange={(e) => handleFileChange("FacilityOtherImage1", e.target.files[0], "other1")} />
            </div>
            {previews.other1 && (
              <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={previews.other1} alt="Other 1" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
            )}
          </div>
        </div>

        {/* Row 2 for Images: Other 2 + Other 3 */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Other Image 2</label>
              <input type="file" style={{ width: "100%" }} onChange={(e) => handleFileChange("FacilityOtherImage2", e.target.files[0], "other2")} />
            </div>
            {previews.other2 && (
              <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={previews.other2} alt="Other 2" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
            )}
          </div>
          <div style={{ flex: "1", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: "1" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Other Image 3</label>
              <input type="file" style={{ width: "100%" }} onChange={(e) => handleFileChange("FacilityOtherImage3", e.target.files[0], "other3")} />
            </div>
            {previews.other3 && (
              <div style={{ width: "60px", height: "60px", border: "1px dashed #ccc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={previews.other3} alt="Other 3" style={{ maxWidth: "100%", maxHeight: "100%" }} />
              </div>
            )}
          </div>
        </div>

        <div style={{ width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px", fontWeight: "600" }}>Description*</label>
          <div style={{ width: "100%", backgroundColor: "#fff", border: "1px solid #ccc" }}>
            <SunEditor
              lang="en"
              name="Description"
              width="100%"
              height="300px"
              setContents={formData.Description || ""}
              onChange={(content) => handleInput("Description", content)}
              setOptions={editorOptions}
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

        <div style={{ marginTop: "30px" }}>
          <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader />} Submit
          </button>
          <Link href="/chanderpur-admin/manage-facilityproduct" className="back-btn" style={{ marginLeft: "10px" }}>
            Back
          </Link>
        </div>
      </div>
    </main>
  );
}
