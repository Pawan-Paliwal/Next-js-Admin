'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetTestimonialByIdQuery, useSaveOrUpdateTestimonialMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/testimonialAPISlice";
import { useGetActiveProductsQuery } from "@/store/backendSlice/productAPISlice";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdTestimonialData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const TestimonialID = searchParams.get("ID");

  const { data: checkData, isSuccess } = useCheckLoginQuery();
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;
  const { data: maxOrderData } = useGetMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: testimonialData } = useGetTestimonialByIdQuery(TestimonialID, { skip: !TestimonialID, refetchOnMountOrArgChange: true });
  const { data: productsData } = useGetActiveProductsQuery();
  const [saveOrUpdateTestimonial, { isLoading }] = useSaveOrUpdateTestimonialMutation();

  const [previewImage, setPreviewImage] = useState("");
  const [openPages, setOpenPages] = useState(false);
  const dropdownPageRef = useRef(null);

  const availablePages = ["Home", "Partner", "Careers"];

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    TestimonialPages: [],
    TestimonialName: "",
    TestimonialNameURL: "",
    TestimonialImage: null,
    Location: "",
    Description: "",
    ActiveStatus: false,
    DisplayOrder: 0
  });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/afford-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = TestimonialID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${TestimonialID ? 'edit' : 'add'} testimonial`);
        router.push("/afford-admin/manage-testimonial");
      }
    }
  }, [isPermissionsReady, pagePermission, TestimonialID, router]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownPageRef.current && !dropdownPageRef.current.contains(event.target)) {
        setOpenPages(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (testimonialData?.success) {
      const data = testimonialData.data;
      setFormData({
        TestimonialPages: data.TestimonialPages || [],
        TestimonialName: data.TestimonialName || "",
        TestimonialNameURL: data.TestimonialNameURL || "",
        TestimonialImage: null,
        Location: data.Location || "",
        Description: data.Description || "",
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.TestimonialImage) {
        setPreviewImage(`/OnlineImages/TestimonialImages/${data.TestimonialImage}`);
      } else {
        setPreviewImage(null);
      }
    } else if (!TestimonialID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [testimonialData, maxOrderData, TestimonialID]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file, nameSuffix) => {
    const ext = file.name.split(".").pop();
    const slug = formData.TestimonialNameURL?.replace(/\s+/g, "-");
    const randomNum = Math.floor(Math.random() * 90) + 10; // Random 2-digit number (10-99)
    return new File([file], `${slug}${nameSuffix}-${randomNum}.${ext}`, { type: file.type });
  };


  const validationRules = {
    TestimonialName: {
      required: true,
      requiredMessage: "Please enter testimonial name."
    },
    Description: {
      required: true,
      requiredMessage: "Please enter description."
    }
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
      if (key === "TestimonialPages") {
        data.append("TestimonialPages", JSON.stringify(value));
      } else if (key === "TestimonialImage" && value instanceof File) {
        data.append("TestimonialImage", handleFileRename(value, ""));
      } else if (key === "ActiveStatus") {
        data.append("ActiveStatus", value ? "1" : "0");
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
        router.push("/afford-admin/manage-testimonial");
      } else {
        toast.error(res.message || "Save failed");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(message);
      console.error(error);
    }
  };

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>Add/Update Testimonial Data</h1>
        <div className="form-group-row" style={{ marginBottom: "20px" }}>
          <div className="selectCat form-group displayorder">
            <label>Products & Pages *</label>
            <div
              className="input_wrap placeholder"
              onClick={() => setOpenPages(prev => !prev)}
            >
              <input
                type="text"
                placeholder="Select Products & Pages"
                value={
                  formData.TestimonialPages.length
                    ? formData.TestimonialPages.join(", ")
                    : ""
                }
                readOnly
              />
            </div>
            <div
              className={`dropdown__wrap ${openPages ? "active" : ""}`}
              ref={dropdownPageRef}
            >
              <div className="dropdown_menu">
                {availablePages.map(page => (
                  <div className="options" key={`page-${page}`}>
                    <input
                      id={`page-${page}`}
                      type="checkbox"
                      checked={formData.TestimonialPages.includes(page)}
                      onChange={(e) => {
                        const newSelected = e.target.checked
                          ? [...formData.TestimonialPages, page]
                          : formData.TestimonialPages.filter(name => name !== page);
                        setFormData(prev => ({ ...prev, TestimonialPages: newSelected }));
                        setFormErrors(prev => ({ ...prev, TestimonialPages: "" }));
                      }}
                    />
                    <div className="in-bx"></div>
                    <span>{page}</span>
                  </div>
                ))}
                {(productsData?.products || []).map(p => (
                  <div className="options" key={`prod-${p.ProductId}`}>
                    <input
                      id={`prod-${p.ProductId}`}
                      type="checkbox"
                      checked={formData.TestimonialPages.includes(p.ProductName)}
                      onChange={(e) => {
                        const newSelected = e.target.checked
                          ? [...formData.TestimonialPages, p.ProductName]
                          : formData.TestimonialPages.filter(name => name !== p.ProductName);
                        setFormData(prev => ({ ...prev, TestimonialPages: newSelected }));
                        setFormErrors(prev => ({ ...prev, TestimonialPages: "" }));
                      }}
                    />
                    <div className="in-bx"></div>
                    <span>{p.ProductName}</span>
                  </div>
                ))}
              </div>
            </div>
            {formErrors.TestimonialPages && <p className="error">{formErrors.TestimonialPages}</p>}
          </div>

          <div className="form-group displayorder">
            <label>Title*</label>
            <input
              type="text"
              value={formData.TestimonialName}
              placeholder="Luca Ferraro"
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
              value={formData.TestimonialNameURL}
              onChange={(e) => handleInput("TestimonialNameURL", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Location OR Designation</label>
            <input
              type="text"
              placeholder="Aldershot Town FC stadium at the EBB Stadium OR Senior Expert"
              value={formData.Location}
              onChange={(e) => {
                handleInput("Location", e.target.value);
                setFormErrors(prev => ({ ...prev, Location: "" }));
              }}
            />
            {formErrors.Location && <p className="error">{formErrors.Location}</p>}
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              onChange={(e) => {
                handleInput("TestimonialImage", e.target.files?.[0] || null);
                setFormErrors(prev => ({ ...prev, TestimonialImage: "" }));
              }}
            />
            <span className="hint-text">(Image Size 100 × 100 px)</span>
            {formErrors.TestimonialImage && <p className="error">{formErrors.TestimonialImage}</p>}
          </div>
          {previewImage && <img src={previewImage} alt="Testimonial" width={70} height={70} />}
        </div>
        <div className="form-group-row row" style={{ marginBottom: "20px" }}>
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              placeholder="Hotels are comfortable, but they are often the most expensive choice."
              value={formData.Description}
              onChange={(e) => {
                handleInput("Description", e.target.value);
                setFormErrors(prev => ({ ...prev, Description: "" }));
              }}
            />
            {formErrors.Description && <p className="error">{formErrors.Description}</p>}
          </div>
          <div className="form-group displayorder">
            <label>Display Order</label>
            <input
              type="text"
              placeholder="0"
              value={formData.DisplayOrder || ""}
              onChange={(e) =>
                handleInput(
                  "DisplayOrder",
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>
          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkActiveStatus"
              checked={formData.ActiveStatus}
              onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
          </div>
        </div>
        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/afford-admin/manage-testimonial" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}