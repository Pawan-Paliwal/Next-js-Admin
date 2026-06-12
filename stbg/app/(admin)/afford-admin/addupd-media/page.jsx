'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetMediaByIdQuery, useSaveOrUpdateMediaMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/mediaAPISlice";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdMediaData() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const MediaID = searchParams.get("ID");

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
      const requiredPermission = MediaID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${MediaID ? 'edit' : 'add'} media`);
        router.push("/afford-admin/manage-media");
      }
    }
  }, [isPermissionsReady, pagePermission, MediaID, router]);

  const { data: mediaData } = useGetMediaByIdQuery(MediaID, {
    skip: !MediaID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdateMedia, { isLoading }] = useSaveOrUpdateMediaMutation();
  const { data: maxOrderData } = useGetMaxDisplayOrderQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    Title: "",
    MediaDate: "",
    MediaImage: null,
    ThirdPartyLink: "",
    DisplayOrder: 1,
    ActiveStatus: false,
    DisplayOnHome: false,
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (mediaData?.success) {
      const data = mediaData.data;
      const formattedDate = data.MediaDate ? new Date(data.MediaDate).toISOString().split('T')[0] : "";
      setFormData({
        Title: data.Title || "",
        MediaDate: formattedDate || "",
        MediaImage: data.MediaImage || null,
        ThirdPartyLink: data.ThirdPartyLink || "",
        DisplayOrder: data.DisplayOrder != null ? data.DisplayOrder : 1,
        ActiveStatus: data.ActiveStatus != null ? data.ActiveStatus : false,
        DisplayOnHome: data.DisplayOnHome != null ? data.DisplayOnHome : false,
      });
      setPreviewImage(data.MediaImage ? `/OnlineImages/MediaImages/${data.MediaImage}` : "");
    } else if (!MediaID && maxOrderData?.maxOrder != null) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [mediaData, maxOrderData, MediaID]);

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
    Title: { required: true, requiredMessage: "Please enter media title." },
    MediaDate: { required: true, requiredMessage: "Please select media date." },
    MediaImage: { required: !MediaID, requiredMessage: "Please select media image." },
    ThirdPartyLink: { required: !MediaID, requiredMessage: "Please enter media third party link." },
    DisplayOrder: { required: true, requiredMessage: "Please enter display order." },
  };

  const handleSubmit = async () => {
    const requiredPermission = MediaID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${MediaID ? 'edit' : 'add'} media`);
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
    data.append("MediaDate", formData.MediaDate);
    data.append("ThirdPartyLink", formData.ThirdPartyLink);
    data.append("DisplayOrder", formData.DisplayOrder);
    data.append("ActiveStatus", formData.ActiveStatus ? "1" : "0");
    data.append("DisplayOnHome", formData.DisplayOnHome ? "1" : "0");
    data.append("UpdatedBy", "Admin Panel");
    if (formData.MediaImage instanceof File) {
      data.append("MediaImage", handleFileRename(formData.MediaImage));
    } else if (typeof formData.MediaImage === "string") {
      data.append("MediaImage", formData.MediaImage);
    }
    if (MediaID) {
      data.append("MediaID", String(MediaID));
    }
    try {
      const res = await saveOrUpdateMedia(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/afford-admin/manage-media");
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
        <h1>{MediaID ? "Update Media Data" : "Add Media Data"}</h1>
        <div className="form-group-row">
          <div className="form-group">
            <label>Media Title*</label>
            <input
              type="text"
              value={formData.Title || ""}
              placeholder="Affordplan targets Rs 1,000 crore in GTV by FY26"
              onChange={(e) => {
                handleInput("Title", e.target.value);
                setFormErrors(prev => ({ ...prev, Title: "" }));
              }}
            />
            {formErrors.Title && <p className="error">{formErrors.Title}</p>}
          </div>

          <div className="form-group">
            <label>Media Date*</label>
            <input
              type="date"
              value={formData.MediaDate || ""}
              onChange={(e) => {
                handleInput("MediaDate", e.target.value);
                setFormErrors(prev => ({ ...prev, MediaDate: "" }));
              }}
            />
            {formErrors.MediaDate && <p className="error">{formErrors.MediaDate}</p>}
          </div>

          <div className="form-group">
            <label>Third Party Link*</label>
            <input
              type="url"
              value={formData.ThirdPartyLink || ""}
              placeholder="https://example.com/article"
              onChange={(e) => {
                handleInput("ThirdPartyLink", e.target.value);
                setFormErrors(prev => ({ ...prev, ThirdPartyLink: "" }));
              }}
            />
            {formErrors.ThirdPartyLink && <p className="error">{formErrors.ThirdPartyLink}</p>}
          </div>

          <div className="form-group">
            <label>Media Image*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleInput("MediaImage", file);
                if (file) setPreviewImage(URL.createObjectURL(file));
                setFormErrors(prev => ({ ...prev, MediaImage: "" }));
              }}
            />
            <span className="hint-text">(Image Size 768 × 650 px)</span>
            {formErrors.MediaImage && <p className="error">{formErrors.MediaImage}</p>}
          </div>

          {previewImage && (
            <img
              src={previewImage}
              alt="Media Preview"
              height={80}
              style={{ marginTop: "10px" }}
            />
          )}
        </div>

        <div className="form-group-row">
          <div className="form-group displayorder" style={{ display: "none" }}>
            <label style={{ marginTop: "22px" }}>Display Order</label>
            <input
              type="number"
              placeholder="0"
              value={formData.DisplayOrder != null ? formData.DisplayOrder : ""}
              min="0"
              onChange={(e) => handleInput("DisplayOrder", Number(e.target.value))}
            />
          </div>

          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkActiveStatus"
              checked={!!formData.ActiveStatus}
              onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
            />
            <label htmlFor="chkActiveStatus">Active Status</label>
          </div>

          <div className="form-group-row statusac">
            <input
              type="checkbox"
              id="chkDisplayOnHome"
              checked={!!formData.DisplayOnHome}
              onChange={(e) => handleInput("DisplayOnHome", e.target.checked)}
            />
            <label htmlFor="chkDisplayOnHome">Display On Home</label>
          </div>
        </div>
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Submit"}
        </button>

        <Link href="/afford-admin/manage-media" className="back-btn">
          Back
        </Link>
      </div>
    </main>
  );
}
