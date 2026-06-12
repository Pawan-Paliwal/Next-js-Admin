'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetPartnerLogoByIdQuery, useSaveOrUpdatePartnerLogoMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/partnerLogoAPISlice";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdPartnerLogoData() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const PartnerLogoID = searchParams.get("ID");
    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000, });
    const pagePermission = usePagePermission(checkData);
    const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;
    const { data: partnerLogoData } = useGetPartnerLogoByIdQuery(PartnerLogoID, { skip: !PartnerLogoID, refetchOnMountOrArgChange: true, refetchOnFocus: true, });
    const { data: maxOrderData, isLoading: isMaxOrderLoading } = useGetMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true, });
    const [previewImage, setPreviewImage] = useState("");
    const [saveOrUpdatePartnerLogo, { isLoading }] = useSaveOrUpdatePartnerLogoMutation();

    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/afford-admin/login");
        }
    }, [isSuccess, checkData, router]);



    useEffect(() => {
        if (isPermissionsReady) {
            const requiredPermission = PartnerLogoID ? pagePermission.CanWrite : pagePermission.CanAdd;
            if (requiredPermission !== 1) {
                toast.error(`You do not have permission to ${PartnerLogoID ? 'edit' : 'add'}`);
                router.push("/afford-admin/manage-partner-logo");
            }
        }
    }, [isPermissionsReady, pagePermission, PartnerLogoID, router]);

    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        PartnerLogoImage: null,
        ActiveStatus: false,
        DisplayOnHome: false,
        DisplayOrder: 1,
    });

    useEffect(() => {
        if (partnerLogoData?.success) {
            const data = partnerLogoData.data;
            setFormData({
                PartnerLogoImage: data.PartnerLogoImage,
                ActiveStatus: data.ActiveStatus,
                DisplayOnHome: data.DisplayOnHome,
                DisplayOrder: data.DisplayOrder
            });
            setPreviewImage(data.PartnerLogoImage ? `/OnlineImages/PartnerLogoImages/${data.PartnerLogoImage}` : "");
        }
        else if (!PartnerLogoID && maxOrderData?.maxOrder !== undefined) {
            setFormData((prev) => ({
                ...prev,
                DisplayOrder: maxOrderData.maxOrder + 1,
            }));
        }
    }, [partnerLogoData, maxOrderData, PartnerLogoID]);

    const handleInput = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const validationRules = {
        PartnerLogoImage: {
            required: !PartnerLogoID,
            requiredMessage: "Please upload PartnerLogo Image."
        }
    };

    const handleFileRename = (file) => {
        if (!file || !file.name) return null;
        const ext = file.name.split('.').pop();
        const uniqueName =
            "partner-logo-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 1000000);
        return new File([file], `${uniqueName}.${ext}`, { type: file.type });
    };

    const handleSubmit = async () => {
        const requiredPermission = PartnerLogoID ? pagePermission.CanWrite : pagePermission.CanAdd;
        if (requiredPermission !== 1) {
            toast.error(`You do not have permission to ${PartnerLogoID ? 'edit' : 'add'}`);
            return;
        }
        const errors = validateFields(formData, validationRules);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        const data = new FormData();
        if (formData.PartnerLogoImage instanceof File) {
            const renamedFile = handleFileRename(formData.PartnerLogoImage, "partner-logo");
            if (renamedFile) {
                data.append("PartnerLogoImage", renamedFile);
            }
        } else if (PartnerLogoID && typeof formData.PartnerLogoImage === "string" && formData.PartnerLogoImage.trim() !== "") {
            data.append("PartnerLogoImage", formData.PartnerLogoImage);
        }

        data.append("ActiveStatus", formData.ActiveStatus ? 1 : 0);
        data.append("DisplayOnHome", formData.DisplayOnHome ? 1 : 0);
        data.append("DisplayOrder", formData.DisplayOrder);
        data.append("UpdatedBy", "Admin Panel");

        if (PartnerLogoID) {
            data.append("PartnerLogoID", PartnerLogoID);
        }

        try {
            const res = await saveOrUpdatePartnerLogo(data).unwrap();
            if (res.success) {
                toast.success(res.message);
                router.push("/afford-admin/manage-partner-logo");
            } else {
                toast.error(res.message || "Save failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <main className="add_update container">
            <div className="form-box">
                <h1>Add/Update Partner Logo Data</h1>
                <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px" }}>
                    <div className="colA">
                        <div className="form-group">
                            <label>Logo Image*</label>
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
                            <span className="hint-text">(Image Size 350 × 132 px)</span>
                            {formErrors.PartnerLogoImage && <p className="error">{formErrors.PartnerLogoImage}</p>}
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
                            value={formData.DisplayOrder || ""}
                            onChange={(e) =>
                                handleInput("DisplayOrder", Number(e.target.value))
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
                    <div className="form-group-row statusac">
                        <input
                            type="checkbox"
                            id="chkDisplayOnHome"
                            checked={formData.DisplayOnHome}
                            onChange={(e) => handleInput("DisplayOnHome", e.target.checked)}
                        />
                        <label htmlFor="chkDisplayOnHome">Display On Home (Active/Inactive)</label>
                    </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <Loader />} Submit
                </button>

                <Link href="/afford-admin/manage-partner-logo" className="back-btn">
                    Back
                </Link>
            </div>
        </main>
    );
}