'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetMilestoneByIdQuery, useSaveOrUpdateMilestoneMutation, useGetMaxMilestoneDisplayOrderQuery } from "@/store/backendSlice/milestoneAPISlice";

import { usePagePermission } from "../usePagePermission";
import { validateFields } from "@/utils/validateFields";



export default function AddUpdMilestoneData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const MilestoneID = searchParams.get("ID");
  const { data: maxOrderData } = useGetMaxMilestoneDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: checkData, isSuccess } = useCheckLoginQuery();
  const pagePermission = usePagePermission(checkData);
  const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

  useEffect(() => {
    if (isSuccess && !checkData?.loggedIn) {
      router.push("/afford-admin/login");
    }
  }, [isSuccess, checkData, router]);

  useEffect(() => {
    if (isPermissionsReady) {
      const requiredPermission = MilestoneID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${MilestoneID ? 'edit' : 'add'} milestone`);
        router.push("/afford-admin/manage-milestone");
      }
    }
  }, [isPermissionsReady, pagePermission, MilestoneID, router]);

  const { data: milestoneData, error } = useGetMilestoneByIdQuery(MilestoneID, {
    skip: !MilestoneID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateMilestone, { isLoading }] = useSaveOrUpdateMilestoneMutation();

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    MilestoneImage: null,
    ActiveStatus: false,
    DisplayOrder: 1,
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (milestoneData?.success) {
      const data = milestoneData.data;
      setFormData({
        Title: data.Title || "",
        Description: data.Description || "",
        MilestoneImage: data.MilestoneImage || null,
        ActiveStatus: data.ActiveStatus,
        DisplayOrder: data.DisplayOrder || 1,
      });
      setPreviewImage(data.MilestoneImage ? `/OnlineImages/MilestoneImages/${data.MilestoneImage}` : "");
    }
    else if (!MilestoneID && maxOrderData?.maxOrder !== undefined) {
      setFormData(prev => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [milestoneData, maxOrderData, MilestoneID]);


  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleFileRename = (file) => {
    const ext = file.name.split(".").pop();
    const slug = generateSlug(formData.Title) || "file";
    const randomNum = Math.floor(10 + Math.random() * 90);
    return new File([file], `${slug}-image-${randomNum}.${ext}`, { type: file.type });
  };

  const validationRules = {
    Title: {
      required: true,
      requiredMessage: "Please enter milestone title."
    },
    Description: {
      required: true,
      requiredMessage: "Please enter description."
    },
    MilestoneImage: {
      required: !MilestoneID,
      requiredMessage: "Please select milestone image."
    }
  };



  const handleSubmit = async () => {
    const requiredPermission = MilestoneID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${MilestoneID ? 'edit' : 'add'} milestone`);
      return;
    }
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    const data = new FormData();
    data.append("Title", formData.Title);
    data.append("Description", formData.Description);
    data.append("ActiveStatus", formData.ActiveStatus ? "1" : "0");
    data.append("DisplayOrder", formData.DisplayOrder);
    data.append("UpdatedBy", "Admin Panel");
    if (formData.MilestoneImage instanceof File) {
      data.append("MilestoneImage", handleFileRename(formData.MilestoneImage));
    } else if (typeof formData.MilestoneImage === "string") {
      data.append("MilestoneImage", formData.MilestoneImage);
    }
    if (MilestoneID) {
      data.append("MilestoneID", String(MilestoneID));
    }
    try {
      const res = await saveOrUpdateMilestone(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/afford-admin/manage-milestone");
      } else {
        toast.error(res.message || "Save failed");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };





  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{MilestoneID ? "Update" : "Add"} Milestone Data</h1>
        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "15px" }}>
          <div className="form-group">
            <label>*Milestone Title</label>
            <input
              type="text"
              value={formData.Title}
              placeholder="Excellence in healthcare innovation"
              onChange={(e) => {
                const val = e.target.value;
                handleInput("Title", val);
                setFormErrors(prev => ({ ...prev, Title: "" }));
              }}
            />
            {formErrors.Title && <p className="error">{formErrors.Title}</p>}
          </div>
          <div className="form-group">
            <label>*Description</label>
            <input
              value={formData.Description}
              placeholder="Recognizing groundbreaking ideas and technologies..."
              onChange={(e) => {
                handleInput("Description", e.target.value);
                setFormErrors(prev => ({ ...prev, Description: "" }));
              }}
              rows={3}
              style={{ resize: "vertical" }}
            />
            {formErrors.Description && <p className="error">{formErrors.Description}</p>}
          </div>
          <div className="form-group">
            <label>*Milestone Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInput("MilestoneImage", file);
                if (file) {
                  setPreviewImage(URL.createObjectURL(file));
                }
                setFormErrors(prev => ({ ...prev, MilestoneImage: "" }));
              }}
            />
            <span className="hint-text">(Image Size 540 × 1024 px)</span>
            {formErrors.MilestoneImage && <p className="error">{formErrors.MilestoneImage}</p>}
          </div>
          {previewImage && (
            <img src={previewImage} alt="Milestone Preview" width={50} />
          )}
        </div>
        <div className="form-group-row" style={{ marginBottom: "15px" }}>
          <div className="form-group displayorder">
            <label>Display Order</label>
            <input
              type="number"
              value={formData.DisplayOrder || ""}
              onChange={(e) => {
                handleInput("DisplayOrder", Number(e.target.value));
                setFormErrors(prev => ({ ...prev, DisplayOrder: "" }));
              }}
              placeholder="1"
            />
            {formErrors.DisplayOrder && <p className="error">{formErrors.DisplayOrder}</p>}
          </div>
          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkActiveStatus"
              checked={formData.ActiveStatus}
              onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus">Active Status (Yes/No)</label>
          </div>

        </div>


        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Submit"}
        </button>
        <Link href="/afford-admin/manage-milestone" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}

