'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetAwardLogoByIdQuery, useSaveOrUpdateAwardLogoMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/awardAPISlice";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdAwardLogoData() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const AwardLogoID = searchParams.get("ID");
    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000, });
    const { data: awardLogoData } = useGetAwardLogoByIdQuery(AwardLogoID, { skip: !AwardLogoID, refetchOnMountOrArgChange: true, refetchOnFocus: true, });
    const { data: maxOrderData, isLoading: isMaxOrderLoading } = useGetMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true, });
    const [previewImage, setPreviewImage] = useState("");
    const [saveOrUpdateAwardLogo, { isLoading }] = useSaveOrUpdateAwardLogoMutation();
    const pagePermission = usePagePermission(checkData);

    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/chanderpur-admin/login");
        }
    }, [isSuccess, checkData, router]);

    useEffect(() => {
        if (checkData?.loggedIn && pagePermission && pagePermission.CanWrite !== 1) {
            toast.error("You do not have permission to access this page");
            router.push("/chanderpur-admin/dashboard");
        }
    }, [checkData, pagePermission, router]);

    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        AwardLogoImage: null,
        ActiveStatus: false,
        DisplayOrder: 1,
    });

    useEffect(() => {
        if (awardLogoData?.success) {
            const data = awardLogoData.data;
            setFormData({
                AwardLogoImage: data.AwardLogoImage,
                ActiveStatus: data.ActiveStatus,
                DisplayOrder: data.DisplayOrder
            });
            setPreviewImage(data.AwardLogoImage ? `/OnlineImages/AwardImages/${data.AwardLogoImage}` : "");
        }
        else if (!AwardLogoID && maxOrderData?.maxOrder !== undefined) {
            setFormData((prev) => ({
                ...prev,
                DisplayOrder: maxOrderData.maxOrder + 1,
            }));
        }
    }, [awardLogoData, maxOrderData, AwardLogoID]);

    const handleInput = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };


    const validationRules = {
        AwardLogoImage: {
            required: !AwardLogoID,
            requiredMessage: "Please upload AwardLogo Image."
        }
    };

    const handleFileRename = (file) => {
        if (!file || !file.name) return null;
        const ext = file.name.split('.').pop();
        const uniqueName =
            "award-logo-" +
            Date.now() +
            "-" +
            Math.floor(Math.random() * 1000000);
        return new File([file], `${uniqueName}.${ext}`, { type: file.type });
    };

    const handleSubmit = async () => {
        const errors = validateFields(formData, validationRules);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const data = new FormData();

        if (formData.AwardLogoImage instanceof File) {
            const renamedFile = handleFileRename(formData.AwardLogoImage, "award-logo");
            if (renamedFile) {
                data.append("AwardLogoImage", renamedFile);
            }
        } else if (AwardLogoID && typeof formData.AwardLogoImage === "string" && formData.AwardLogoImage.trim() !== "") {
            data.append("AwardLogoImage", formData.AwardLogoImage);
        }
        data.append("ActiveStatus", formData.ActiveStatus ? 1 : 0);
        data.append("DisplayOrder", formData.DisplayOrder);
        data.append("UpdatedBy", "Admin Panel");
        if (AwardLogoID) {
            data.append("AwardLogoID", AwardLogoID);
        }
        try {
            const res = await saveOrUpdateAwardLogo(data).unwrap();
            if (res.success) {
                toast.success(res.message);
                router.push("/chanderpur-admin/manage-award");
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
                <h1>Add/Update Award Logo Data</h1>
                <div className="form-group-row file-uploade-sec" style={{ marginBottom: "18px" }}>
                    <div className="colA">
                        <div className="form-group">
                            <label>Logo Image*</label>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleInput("AwardLogoImage", file);
                                        setPreviewImage(URL.createObjectURL(file));
                                    }
                                    setFormErrors(prev => ({ ...prev, AwardLogoImage: "" }));
                                }}
                            />
                            {formErrors.AwardLogoImage && <p className="error">{formErrors.AwardLogoImage}</p>}
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
                </div>
                <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <Loader />} Submit
                </button>

                <Link href="/chanderpur-admin/manage-award" className="back-btn">
                    Back
                </Link>
            </div>
        </main>
    );
}