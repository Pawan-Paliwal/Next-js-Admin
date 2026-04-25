'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetPartnerLogoByIdQuery, useSaveOrUpdatePartnerLogoMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/partnerLogoAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdPartnerLogo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const PartnerLogoID = searchParams.get("ID");
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
      const requiredPermission = PartnerLogoID ? pagePermission.CanWrite : pagePermission.CanAdd;
      if (requiredPermission !== 1) {
        toast.error(`You do not have permission to ${PartnerLogoID ? 'edit' : 'add'} partner logo`);
        router.push("/chanderpur-admin/manage-partnerlogo");
      }
    }
  }, [isPermissionsReady, pagePermission, PartnerLogoID, router]);

  const { data: logoData } = useGetPartnerLogoByIdQuery(PartnerLogoID, {
    skip: !PartnerLogoID,
    refetchOnMountOrArgChange: true,
  });

  const [saveOrUpdatePartnerLogo, { isLoading }] = useSaveOrUpdatePartnerLogoMutation();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    PartnerLogoImage: null,
    ActiveStatus: false,
    DisplayOnHome: false,
    DisplayOrder: 0
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (logoData?.success) {
      const data = logoData.data;
      setFormData({
        PartnerLogoImage: null,
        ActiveStatus: data.ActiveStatus === 1,
        DisplayOnHome: data.DisplayOnHome === 1,
        DisplayOrder: data.DisplayOrder ?? 0,
      });
      if (data.PartnerLogoImage) setPreviewImage(`/OnlineImages/PartnerLogos/${data.PartnerLogoImage}`);
      else setPreviewImage(null);
    }
    else if (!PartnerLogoID && maxOrderData?.maxOrder !== undefined) {
      setFormData((prev) => ({
        ...prev,
        DisplayOrder: maxOrderData.maxOrder + 1,
      }));
    }
  }, [logoData, maxOrderData]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validationRules = {
    PartnerLogoImage: { required: !PartnerLogoID, requiredMessage: "Please upload a logo image." },
  };

  const handleSubmit = async () => {
    const requiredPermission = PartnerLogoID ? pagePermission.CanWrite : pagePermission.CanAdd;
    if (requiredPermission !== 1) {
      toast.error(`You do not have permission to ${PartnerLogoID ? 'edit' : 'add'} partner logo`);
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
      if (key === "PartnerLogoImage" && value instanceof File) {
        data.append("PartnerLogoImage", value);
      } else if (key === "ActiveStatus" || key === "DisplayOnHome") {
        data.append(key, value ? "1" : "0");
      } else if (typeof value === "string" || typeof value === "number") {
        data.append(key, value.toString());
      }
    });

    data.append("UpdatedBy", "Admin Panel");
    if (PartnerLogoID) data.append("PartnerLogoID", PartnerLogoID);

    try {
      const res = await saveOrUpdatePartnerLogo(data).unwrap();
      if (res.success) {
        toast.success(res.message);
        router.push("/chanderpur-admin/manage-partnerlogo");
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
        <h1>Add/Update Partner Logo</h1>

        <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "20px" }}>
          <div className="colA" style={{ width: "43%" }}>
            <div className="form-group">
              <label>Partner Logo Image*</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleInput("PartnerLogoImage", file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                  setFormErrors(prev => ({ ...prev, PartnerLogoImage: "" }));
                }}
              />
              {formErrors.PartnerLogoImage && <p className="error">{formErrors.PartnerLogoImage}</p>}
            </div>
          </div>
          {previewImage && (
            <div className="image-preview"><img src={previewImage} alt="Preview" height={80} style={{ borderRadius: "0" }} /></div>
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
          <div className="form-group-row statusac mt-3">
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input type="checkbox" id="chkActiveStatus" checked={formData.ActiveStatus} onChange={(e) => handleInput("ActiveStatus", e.target.checked)} />
                <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input type="checkbox" id="chkDisplayOnHome" checked={formData.DisplayOnHome} onChange={(e) => handleInput("DisplayOnHome", e.target.checked)} />
                <label htmlFor="chkDisplayOnHome">Display On Home</label>
              </div>
            </div>
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading} style={{ marginTop: "20px" }}>
          {isLoading && <Loader />} Submit
        </button>
        <Link href="/chanderpur-admin/manage-partnerlogo" className="back-btn">Back</Link>
      </div>
    </main>
  );
}