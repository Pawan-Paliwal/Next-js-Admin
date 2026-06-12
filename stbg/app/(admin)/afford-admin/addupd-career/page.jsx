'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "@/components/backendcomponents/SunEditor";
import {
  useFetchCareerByIdQuery,
  useSubmitCareerMutation,
  useGetMaxDisplayOrderQuery
} from "@/store/backendSlice/careerAPISlice";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";


export default function AddUpdCareerData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const JobCategoryID = searchParams.get("ID");
  const { data: checkData, isSuccess, isLoading: isAuthLoading } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  const { data: currentCareer, isLoading } = useFetchCareerByIdQuery(
    Number(JobCategoryID),
    { skip: !JobCategoryID }
  );

  const { data: maxOrderData, isLoading: isMaxOrderLoading } = useGetMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/afford-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = JobCategoryID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${JobCategoryID ? 'edit' : 'add'} job`);
        router.push("/afford-admin/manage-job-category");
      }
    }
  }, [isPermissionsReady, pagePermission, JobCategoryID, router]);

  const [submitCareer] = useSubmitCareerMutation();

  const [formData, setFormData] = useState({
    SerialNo: 0,
    JobCategoryID: 0,
    JobCategoryName: "",
    JobCategoryDescription: "",
    SmallDescription: "",
    JobLocationL: "",
    ActiveStatus: false,
    DisplayOrder: 0,
  });

  const [formErrors, setFormErrors] = useState({});

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  useEffect(() => {
    if (currentCareer?.success && currentCareer.data) {
      setFormData(currentCareer.data);
    } else if (!JobCategoryID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => {
        if (prev.DisplayOrder !== maxOrderData.maxOrder + 1) {
          return { ...prev, DisplayOrder: maxOrderData.maxOrder + 1 };
        }
        return prev;
      });
    }
  }, [currentCareer, maxOrderData, JobCategoryID]);

  const validationRules = {
    JobCategoryName: {
      required: true,
      requiredMessage: "Please enter job category name."
    },
    JobCategoryDescription: {
      required: true,
      requiredMessage: "Please enter job category description."
    },
    JobLocation: {
      required: true,
      requiredMessage: "Please enter job location."
    }
  };

  const handleSubmit = async (e) => {
    const requiredPermission = JobCategoryID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${JobCategoryID ? 'edit' : 'add'} job`);
      return;
    }
    e.preventDefault();
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "boolean") {
            data.append(key, value ? "1" : "0");
          } else {
            data.append(key, String(value));
          }
        }
      });
      data.append("UpdatedBy", "Admin Panel");
      const res = await submitCareer(data).unwrap();
      if (res.success) {
        toast.success(res.message || "Job Category saved successfully");
        try {
          const sitemapResponse = await fetch("/api/sitemap?action=save");
          const sitemapResult = await sitemapResponse.json();
          if (sitemapResult.success) {
            // console.log("Sitemap updated successfully");
          }
        } catch (sitemapError) {
          console.error("Failed to update sitemap:", sitemapError);
        }
        router.push("/afford-admin/manage-job-category");
      } else {
        toast.error(res.message || "Failed to save Job Category");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Error while saving Job Category");
    }
  };


  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>Add/Update Career Data</h1>
        <div className="tabbing_sec">
          <div className="tab-nav-content">
            <div className="" style={{ paddingBottom: "15px" }}>
              <div className="form-group-row update-form">
                <div className="form-group mb-0">
                  <label>Job Title*</label>
                  <input
                    type="text"
                    name="JobCategoryName"
                    placeholder="Content Marketing Intern"
                    value={formData.JobCategoryName || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInput("JobCategoryName", val);
                      setFormErrors(prev => ({ ...prev, JobCategoryName: "" }));
                    }}
                  />
                  {formErrors.JobCategoryName && (
                    <p className="error">{formErrors.JobCategoryName}</p>
                  )}
                </div>
                <div className="form-group mb-0">
                  <label>Job Location*</label>
                  <input
                    type="text"
                    name="JobLocation"
                    placeholder="Delhi, India"
                    value={formData.JobLocation || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInput("JobLocation", val);
                      setFormErrors(prev => ({ ...prev, JobLocation: "" }));
                    }}
                  />
                  {formErrors.JobLocation && (
                    <p className="error">{formErrors.JobLocation}</p>
                  )}
                </div>
                <div className="form-group mb-0" style={{ opacity: "0" }}>
                  <label>Job Small Description*</label>
                  <input
                    type="text"
                    name="SmallDescription"
                    placeholder="We are looking for a creative and enthusiastic Content Marketing Intern"
                    value={formData.SmallDescription || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInput("SmallDescription", val);
                      setFormErrors(prev => ({ ...prev, SmallDescription: "" }));
                    }}
                  />
                  {formErrors.SmallDescription && (
                    <p className="error">{formErrors.SmallDescription}</p>
                  )}
                </div>

              </div>

              <div className="form-group-row file-uploade-sec mt-5" style={{ marginTop: "20px" }}>
                <div className="form-group">
                  <label style={{ marginTop: "12px" }}>Job Description*</label>
                  <SunEditor
                    value={formData.JobCategoryDescription || ""}
                    onChange={(val) => {
                      handleInput("JobCategoryDescription", val);
                      setFormErrors(prev => ({ ...prev, JobCategoryDescription: "" }));
                    }}
                  />
                  {formErrors.JobCategoryDescription && (
                    <p className="error" >{formErrors.JobCategoryDescription}</p>
                  )}
                </div>
              </div>
              <div className="form-group-row">
                <div className="form-group displayorder">
                  <label style={{ marginTop: "12px" }}> Display Order</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.DisplayOrder || ""}
                    onChange={(e) => handleInput("DisplayOrder", Number(e.target.value))}
                  />
                </div>

                <div className="form-group-row statusac">
                  <input
                    type="checkbox"
                    id="chkActiveStatus"
                    checked={formData.ActiveStatus || false}
                    onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
                  />
                  <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
        <Link href="/afford-admin/manage-job-category" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}