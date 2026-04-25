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
import { useGetTestimonialByIdQuery, useSaveOrUpdateTestimonialMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/testimonialAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdTestimonialData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const TestimonialID = searchParams.get("ID");
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
      const requiredPermission = TestimonialID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${TestimonialID ? 'edit' : 'add'} testimonial`);
        router.push("/chanderpur-admin/manage-testimonial");
      }
    }
  }, [isPermissionsReady, pagePermission, TestimonialID, router]);

  const { data: testimonialData } = useGetTestimonialByIdQuery(TestimonialID, {
    skip: !TestimonialID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateTestimonial, { isLoading }] = useSaveOrUpdateTestimonialMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    TestimonialName: "",
    TestimonialNameURL: "",
    TestimonialImage: null,
    TestimonialDescription: "",
    DisplayOnHome: false,
    ActiveStatus: false,
    DisplayOrder: 0
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (testimonialData?.success) {
      const data = testimonialData.data;
      setFormData({
        TestimonialName: data.TestimonialName || "",
        TestimonialNameURL: data.TestimonialNameURL || "",
        TestimonialImage: null,
        TestimonialDescription: data.TestimonialDescription || "",
        DisplayOnHome: data.DisplayOnHome === 1 || data.DisplayOnHome === true,
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.TestimonialImage) {
        setPreviewImage(`/OnlineImages/TestimonialImages/${data.TestimonialImage}`);
      } else {
        setPreviewImage(null);
      }
    }
    else if (!TestimonialID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [testimonialData, maxOrderData]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.TestimonialNameURL?.replace(/\s+/g, "-") || "testimonial";
    const newName = `${slug}${nameSuffix}.${ext}`;
    return new File([file], newName, { type: file.type });
  };

  const validationRules = {
    TestimonialName: { required: true, requiredMessage: "Please enter title." },
    TestimonialImage: { required: !TestimonialID, requiredMessage: "Please upload image." },
    TestimonialDescription: { required: true, requiredMessage: "Please enter description." }
  };

  const handleSubmit = async () => {
    const requiredPermission = TestimonialID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${TestimonialID ? 'edit' : 'add'} testimonial`);
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
      if (key === "TestimonialImage" && value instanceof File) {
        data.append("TestimonialImage", handleFileRename(value, ""));
      } else if (key === "ActiveStatus" || key === "DisplayOnHome") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });

    data.append("UpdatedBy", "Admin Panel");
    data.append("type", "testimonial");
    if (TestimonialID) data.append("TestimonialID", TestimonialID);
    
    try {
      const res = await saveOrUpdateTestimonial(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-testimonial");
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
        <h1>Add/Update Testimonial</h1>
        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px" }}>
          <div className="form-group displayorder">
            <label>Title*</label>
            <input
              type="text"
              placeholder="Sulux Phosphate Ltd."
              value={formData.TestimonialName ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleInput("TestimonialName", val);
                if (!TestimonialID) {
                  handleInput("TestimonialNameURL", generateSlug(val));
                }
                setFormErrors(prev => ({ ...prev, TestimonialName: "" }));
              }}
            />
            {formErrors.TestimonialName && <p className="error">{formErrors.TestimonialName}</p>}
          </div>
          <div className="form-group" style={{ display: "none" }}>
            <label>Title URL*</label>
            <input
              type="text"
              value={formData.TestimonialNameURL ?? ""}
              onChange={(e) => handleInput("TestimonialNameURL", e.target.value)}
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
                    handleInput("TestimonialImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, TestimonialImage: "" }));
                }}
              />
              {formErrors.TestimonialImage && <p className="error">{formErrors.TestimonialImage}</p>}
            </div>
          </div>
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" height={80} />
            </div>
          )}
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
          <div className="form-group-row statusac">
            <input type="checkbox" id="chkDisplayOnHome" checked={formData.DisplayOnHome} onChange={(e) => handleInput("DisplayOnHome", e.target.checked)} />
            <label htmlFor="chkDisplayOnHome">Display On Home</label>
          </div>
        </div>

        <div className="form-group" style={{ display: "block", width: "100%", marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "10px" }}>Description*</label>
          <div style={{ width: "100%", backgroundColor: "#fff" }}>
            <SunEditor
              lang="en"
              name="TestimonialDescription"
              width="100%"
              height="200px"
              setContents={formData.TestimonialDescription || ""}
              onChange={(content) => {
                handleInput("TestimonialDescription", content);
                setFormErrors(prev => ({ ...prev, TestimonialDescription: "" }));
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
          {formErrors.TestimonialDescription && <p className="error">{formErrors.TestimonialDescription}</p>}
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/chanderpur-admin/manage-testimonial" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}
