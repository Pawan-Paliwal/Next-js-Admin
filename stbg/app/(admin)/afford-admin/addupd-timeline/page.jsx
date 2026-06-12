'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";



const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";


export default function AddUpdTimelineData() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const TimelineID = searchParams.get("ID");
    const { data: checkData, isSuccess } = useCheckLoginQuery();
    const pagePermission = usePagePermission(checkData);
    const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;
    const [isLoading, setIsLoading] = useState(false);
    const [isMaxOrderLoading, setIsMaxOrderLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        TimelineName: "",
        TimelineNameURL: "",
        TimelineYear: new Date().getFullYear(),
        Description: "",
        TimelineImage: null,
        DisplayOrder: 1,
        ActiveStatus: false,
    });



    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/afford-admin/login");
        }
    }, [isSuccess, checkData, router]);

    useEffect(() => {
        if (isPermissionsReady) {
            const requiredPermission = TimelineID ? pagePermission.CanWrite : pagePermission.CanAdd;
            if (requiredPermission !== 1) {
                toast.error(`You do not have permission to ${TimelineID ? 'edit' : 'add'} timeline`);
                router.push("/afford-admin/manage-timeline");
            }
        }
    }, [isPermissionsReady, pagePermission, TimelineID, router]);

    // Fetch timeline data by ID
    const fetchTimelineById = async (id) => {
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (authHeader) {
                headers['Authorization'] = authHeader;
            }

            const response = await fetch(`${apiUrl}/timeline/fill-timeline-data?TimelineID=${id}`, {
                method: 'GET',
                headers: headers,
            });

            const result = await response.json();

            if (result.success) {
                const data = result.data;
                setFormData({
                    TimelineName: data.TimelineName || "",
                    TimelineNameURL: data.TimelineNameURL || "",
                    TimelineYear: data.TimelineYear,
                    Description: data.Description || "",
                    TimelineImage: data.TimelineImage,
                    DisplayOrder: data.DisplayOrder,
                    ActiveStatus: data.ActiveStatus
                });
                setPreviewImage(data.TimelineImage ? `/OnlineImages/TimelineImages/${data.TimelineImage}` : "");
            }
        } catch (error) {
            console.error("Error fetching timeline:", error);
            toast.error("Error loading timeline data");
        }
    };

    // Fetch max display order
    const fetchMaxDisplayOrder = async () => {
        setIsMaxOrderLoading(true);
        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (authHeader) {
                headers['Authorization'] = authHeader;
            }

            const response = await fetch(`${apiUrl}/timeline/max-display-order`, {
                method: 'GET',
                headers: headers,
            });
            const result = await response.json();
            if (result.maxOrder !== undefined) {
                setFormData((prev) => ({
                    ...prev,
                    DisplayOrder: result.maxOrder + 1,
                }));
            }
        } catch (error) {
            console.error("Error fetching max display order:", error);
        } finally {
            setIsMaxOrderLoading(false);
        }
    };

    useEffect(() => {
        if (TimelineID) {
            fetchTimelineById(TimelineID);
        } else {
            fetchMaxDisplayOrder();
        }
    }, [TimelineID]);

    const handleInput = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const generateSlug = (text) =>
        text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

    const handleFileRename = (file) => {
        const ext = file.name.split(".").pop();
        const slug = formData.TimelineNameURL?.replace(/\s+/g, "-") || "file";
        const randomNum = Math.floor(10 + Math.random() * 90);
        return new File([file], `${slug}-image-${randomNum}.${ext}`, { type: file.type });
    };

    const validationRules = {
        TimelineName: {
            required: true,
            requiredMessage: "Please enter timeline name."
        },
        TimelineNameURL: {
            required: true,
            requiredMessage: "Please enter timeline URL."
        },
        TimelineYear: {
            required: true,
            requiredMessage: "Please enter timeline year."
        },
        Description: {
            required: true,
            requiredMessage: "Please enter description."
        }
    };

    const handleSubmit = async () => {
        const requiredPermission = TimelineID ? pagePermission.CanWrite : pagePermission.CanAdd;
        if (requiredPermission !== 1) {
            toast.error(`You do not have permission to ${TimelineID ? 'edit' : 'add'} categories`);
            return;
        }
        const errors = validateFields(formData, validationRules);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        const data = new FormData();
        data.append("TimelineName", formData.TimelineName);
        data.append("TimelineNameURL", formData.TimelineNameURL);
        data.append("TimelineYear", formData.TimelineYear);
        data.append("Description", formData.Description);
        data.append("DisplayOrder", formData.DisplayOrder);
        data.append("ActiveStatus", formData.ActiveStatus ? "1" : "0");
        data.append("UpdatedBy", "Admin Panel");
        if (formData.TimelineImage instanceof File) {
            data.append("TimelineImage", handleFileRename(formData.TimelineImage));
        } else if (typeof formData.TimelineImage === "string") {
            data.append("TimelineImage", formData.TimelineImage);
        }
        if (TimelineID) {
            data.append("TimelineID", String(TimelineID));
        }
        setIsLoading(true);
        try {
            const headers = {};
            if (authHeader) {
                headers['Authorization'] = authHeader;
            }
            const response = await fetch(`${apiUrl}/timeline/save-or-update-timeline`, {
                method: 'POST',
                headers: headers,
                body: data,
            });
            const res = await response.json();
            if (res.success) {
                toast.success(res.message);
                router.push("/afford-admin/manage-timeline");
            } else {
                toast.error(res.message || "Save failed");
            }
        } catch (error) {
            console.error("Error saving timeline:", error);
            toast.error(error?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="add_update container">
            <div className="form-box">
                <h1>{TimelineID ? "Update" : "Add"} Timeline Data</h1>
                <div className="form-group-row file-uploade-sec" style={{ marginBottom: "15px" }}>
                    <div className="form-group">
                        <label>*Timeline Name</label>
                        <input
                            type="text"
                            value={formData.TimelineName}
                            placeholder="Design for Manufacturing"
                            onChange={(e) => {
                                const val = e.target.value;
                                handleInput("TimelineName", val);
                                if (!TimelineID) {
                                    handleInput("TimelineNameURL", generateSlug(val));
                                }
                                setFormErrors(prev => ({ ...prev, TimelineName: "", TimelineNameURL: "" }));
                            }}
                        />
                        {formErrors.TimelineName && <p className="error">{formErrors.TimelineName}</p>}
                    </div>

                    <div className="form-group">
                        <label>*Timeline Year</label>
                        <input
                            type="text"
                            value={formData.TimelineYear}
                            placeholder="2024"
                            onChange={(e) => {
                                handleInput("TimelineYear", e.target.value);
                                setFormErrors(prev => ({ ...prev, TimelineYear: "" }));
                            }}
                        />
                        {formErrors.TimelineYear && <p className="error">{formErrors.TimelineYear}</p>}
                    </div>


                    <div className="form-group" style={{ width: "25%", display: "none" }}>
                        <label>*Timeline Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleInput("TimelineImage", file);
                                if (file) {
                                    setPreviewImage(URL.createObjectURL(file));
                                }
                                setFormErrors(prev => ({ ...prev, TimelineImage: "" }));
                            }}
                        />
                        {formErrors.TimelineImage && <p className="error">{formErrors.TimelineImage}</p>}
                    </div>
                    <div className="form-group" style={{ display: "none" }}>
                        <label>*Timeline URL</label>
                        <input
                            type="text"
                            placeholder="design-for-manufacturing"
                            value={formData.TimelineNameURL}
                            onChange={(e) => {
                                handleInput("TimelineNameURL", e.target.value);
                                setFormErrors(prev => ({ ...prev, TimelineNameURL: "" }));
                            }}
                        />
                        {formErrors.TimelineNameURL && <p className="error">{formErrors.TimelineNameURL}</p>}
                    </div>
                </div>
                <div className="form-group-row">

                    <div className="form-group">
                        <label>*Description</label>
                        <input
                            type="text"
                            value={formData.Description}
                            placeholder="Brief description of the timeline"
                            onChange={(e) => {
                                handleInput("Description", e.target.value);
                                setFormErrors(prev => ({ ...prev, Description: "" }));
                            }}
                        />
                        {formErrors.Description && <p className="error">{formErrors.Description}</p>}
                    </div>
                </div>
                <div className="form-group-row" style={{ marginBottom: "15px" }}>
                    <div className="form-group displayorder" style={{ marginTop: "22px" }}>
                        <label>Display Order</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={formData.DisplayOrder || ""}
                            onChange={(e) =>
                                handleInput(
                                    "DisplayOrder",
                                    e.target.value === "" ? 0 : Number(e.target.value)
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
                <Link href="/afford-admin/manage-timeline" className="back-btn">
                    Back
                </Link>
            </div>
        </main>
    );
}