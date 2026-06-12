'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetManufacturingByIdQuery, useSaveOrUpdateManufacturingMutation, useGetMaxDisplayOrderQuery } from "@/store/backendSlice/manufacturingAPISlice";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdManufacturingData() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ManufacturingID = searchParams.get("ID");
    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000, });
    const pagePermission = usePagePermission(checkData);
    const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

    const { data: manufacturingData } = useGetManufacturingByIdQuery(ManufacturingID, { skip: !ManufacturingID, refetchOnMountOrArgChange: true });
    const { data: maxOrderData } = useGetMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true, });

    const [previewVideo, setPreviewVideo] = useState("");
    const [saveOrUpdateManufacturing, { isLoading }] = useSaveOrUpdateManufacturingMutation();

    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/chanderpur-admin/login");
        }
    }, [isSuccess, checkData, router]);

    useEffect(() => {
        if (isPermissionsReady) {
            const requiredPermission = ManufacturingID ? pagePermission.CanWrite : pagePermission.CanAdd;
            if (requiredPermission !== 1) {
                toast.error(`You do not have permission to ${ManufacturingID ? 'edit' : 'add'} manufacturing data`);
                router.push("/chanderpur-admin/manage-manufacturing");
            }
        }
    }, [isPermissionsReady, pagePermission, ManufacturingID, router]);

    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        ManufacturingName: "",
        ManufacturingNameURL: "",
        ManufacturingVideoUrl: null,
        ActiveStatus: true,
        DisplayOrder: 1,
    });

    useEffect(() => {
        if (manufacturingData?.success) {
            const data = manufacturingData.data;
            setFormData({
                ManufacturingName: data.ManufacturingName || "",
                ManufacturingNameURL: data.ManufacturingNameURL || "",
                ManufacturingVideoUrl: data.ManufacturingVideoUrl || null,
                ActiveStatus: data.ActiveStatus === 1,
                DisplayOrder: data.DisplayOrder ?? 0
            });
            if (data.ManufacturingVideoUrl) {
                setPreviewVideo(`/OnlineImages/ManufacturingImages/${data.ManufacturingVideoUrl}`);
            }
        }
        else if (!ManufacturingID && maxOrderData?.maxOrder !== undefined) {
            setFormData((prev) => ({
                ...prev,
                DisplayOrder: maxOrderData.maxOrder + 1,
            }));
        }
    }, [manufacturingData, maxOrderData, ManufacturingID]);

    const handleInput = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field === "ManufacturingName") {
            const url = value.toLowerCase().trim()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            setFormData((prev) => ({ ...prev, ManufacturingNameURL: url }));
        }
    };

    const validationRules = {
        ManufacturingName: { required: true, requiredMessage: "Please enter Manufacturing Name." },
        ManufacturingNameURL: { required: true, requiredMessage: "Please enter Name URL." },
        ManufacturingVideoUrl: {
            required: !ManufacturingID,
            requiredMessage: "Please upload Manufacturing Video."
        }
    };

    const handleFileRename = (file, nameSuffix = "") => {
        if (!file || !file.name) return null;
        const ext = file.name.split('.').pop();
        const slug = formData.ManufacturingNameURL?.replace(/\s+/g, "-") || "manufacturing";
        const newName = `${slug}${nameSuffix}.${ext}`;
        return new File([file], newName, { type: file.type });
    };

    const handleSubmit = async () => {
        const requiredPermission = ManufacturingID ? pagePermission.CanWrite : pagePermission.CanAdd;
        if (requiredPermission !== 1) {
            toast.error(`You do not have permission to ${ManufacturingID ? 'edit' : 'add'} manufacturing data`);
            return;
        }
        const errors = validateFields(formData, validationRules);
        if (!ManufacturingID && !formData.ManufacturingVideoUrl) {
            errors.ManufacturingVideoUrl = "Please upload Manufacturing Video.";
        }
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error("Please fill all required fields");
            return;
        }
        setFormErrors({});
        const data = new FormData();
        data.append("ManufacturingName", formData.ManufacturingName);
        data.append("ManufacturingNameURL", formData.ManufacturingNameURL);

        if (formData.ManufacturingVideoUrl instanceof File) {
            const renamedFile = handleFileRename(formData.ManufacturingVideoUrl);
            if (renamedFile) {
                data.append("ManufacturingVideoUrl", renamedFile);
            }
        }

        data.append("ActiveStatus", formData.ActiveStatus ? 1 : 0);
        data.append("DisplayOrder", formData.DisplayOrder);
        data.append("UpdatedBy", "Admin Panel");
        if (ManufacturingID) {
            data.append("ManufacturingID", ManufacturingID);
        }
        try {
            const res = await saveOrUpdateManufacturing(data).unwrap();
            if (res.success) {
                toast.success(res.message);
                router.push("/chanderpur-admin/manage-manufacturing");
            } else {
                toast.error(res.message || "Save failed");
            }
        } catch (error) {
            toast.error(error?.data?.message);
        }
    };

    return (
        <main className="add_update container">
            <div className="form-box">
                <h1>{ManufacturingID ? "Update" : "Add"} Manufacturing Data</h1>

                <div className="form-group-row" style={{ width: "60%", display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    <div className="form-group" style={{ flex: "1" }}>
                        <label>Manufacturing Name*</label>
                        <input
                            type="text"
                            placeholder="Enter manufacturing name (e.g. Cement Plant)"
                            value={formData.ManufacturingName}
                            onChange={(e) => {
                                handleInput("ManufacturingName", e.target.value);
                                setFormErrors(prev => ({
                                    ...prev,
                                    ManufacturingName: "",
                                    ManufacturingNameURL: ""
                                }));
                            }}
                        />
                        {formErrors.ManufacturingName && <p className="error">{formErrors.ManufacturingName}</p>}
                    </div>
                    <div className="form-group" style={{ flex: "1" }}>
                        <label>Video File (Upload)*</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    handleInput("ManufacturingVideoUrl", file);
                                    setPreviewVideo(URL.createObjectURL(file));
                                }
                                setFormErrors(prev => ({ ...prev, ManufacturingVideoUrl: "" }));
                            }}
                        />
                        {formErrors.ManufacturingVideoUrl && <p className="error">{formErrors.ManufacturingVideoUrl}</p>}
                    </div>
                    {previewVideo && (
                        <div className="video-preview" >
                            <video src={previewVideo} key={previewVideo} controls height={60} style={{ borderRadius: "8px", border: "1px solid #ddd" }} />
                        </div>
                    )}

                    <div className="form-group" style={{ opacity: "0", position: "absolute", zIndex: "-1" }}>
                        <label>Name URL*</label>
                        <input
                            type="text"
                            placeholder="Enter URL"
                            value={formData.ManufacturingNameURL}
                            onChange={(e) => {
                                handleInput("ManufacturingNameURL", e.target.value);
                                setFormErrors(prev => ({ ...prev, ManufacturingNameURL: "" }));
                            }}
                        />
                        {formErrors.ManufacturingNameURL && <p className="error">{formErrors.ManufacturingNameURL}</p>}
                    </div>
                </div>

                <div className="form-group-row" style={{ marginTop: "18px" }}>
                    <div className="form-group displayorder">
                        <label>Display Order</label>
                        <input
                            type="number"
                            placeholder="Enter display order (e.g. 1)"
                            value={formData.DisplayOrder ?? ""}
                            onChange={(e) =>
                                handleInput("DisplayOrder", e.target.value === "" ? "" : Number(e.target.value))
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

                <div className="button-group">
                    <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader />} {ManufacturingID ? "Update" : "Submit"}
                    </button>

                    <Link href="/chanderpur-admin/manage-manufacturing" className="back-btn">
                        Back
                    </Link>
                </div>
            </div>
        </main>
    );
}
