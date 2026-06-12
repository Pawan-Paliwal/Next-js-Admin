'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetCategoryByIdQuery, useGetMaxDisplayOrderQuery, useSaveOrUpdateCategoryMutation } from "@/store/backendSlice/categoryAPISlice";
import { validateFields } from "@/utils/validateFields";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdCategoryData() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const CategoryID = searchParams.get("ID");

    const { data: checkData, isSuccess, isLoading: isAuthLoading } = useCheckLoginQuery(undefined, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 10000,
    });

    const pagePermission = usePagePermission(checkData);

    // Wait for permissions to be ready
    const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

    const { data: categoryData, error } = useGetCategoryByIdQuery(CategoryID, {
        skip: !CategoryID,
        refetchOnMountOrArgChange: true,
    });

    const { data: maxOrderData, isLoading: isMaxOrderLoading } = useGetMaxDisplayOrderQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [saveOrUpdateCategory, { isLoading }] = useSaveOrUpdateCategoryMutation();

    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        CategoryName: "",
        CategoryNameURL: "",
        SmallDescription: "",
        CategoryImage: null,
        DisplayOrder: 0,
        DisplayOnHome: false,
        DisplayOnHeader: false,
        ActiveStatus: false,
    });

    const [previewImage, setPreviewImage] = useState("");

    // Check login status
    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/afford-admin/login");
        }
    }, [isSuccess, checkData, router]);

    // Check permissions after they're loaded
    useEffect(() => {
        if (isPermissionsReady) {
            // For add/update page, check appropriate permission
            const requiredPermission = CategoryID ? pagePermission.CanWrite : pagePermission.CanAdd;
            if (requiredPermission !== 1) {
                toast.error(`You do not have permission to ${CategoryID ? 'edit' : 'add'} categories`);
                router.push("/afford-admin/manage-category");
            }
        }
    }, [isPermissionsReady, pagePermission, CategoryID, router]);
    // Load category data for edit mode
    useEffect(() => {
        if (categoryData?.success) {
            const data = categoryData.data;
            setFormData({
                CategoryName: data.CategoryName || "",
                CategoryNameURL: data.CategoryNameURL || "",
                SmallDescription: data.SmallDescription || "",
                CategoryImage: data.CategoryImage || null,
                DisplayOrder: data.DisplayOrder || 0,
                DisplayOnHome: data.DisplayOnHome,
                DisplayOnHeader: data.DisplayOnHeader,
                ActiveStatus: data.ActiveStatus
            });
            setPreviewImage(data.CategoryImage ? `/OnlineImages/CategoryImages/${data.CategoryImage}` : "");
        } else if (!CategoryID && maxOrderData?.maxOrder !== undefined) {
            setFormData((prev) => ({
                ...prev,
                DisplayOrder: maxOrderData.maxOrder + 1,
            }));
        }
    }, [categoryData, maxOrderData, CategoryID]);

    const handleInput = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const generateSlug = (text) =>
        text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

    const handleFileRename = (file) => {
        const ext = file.name.split(".").pop();
        const slug = formData.CategoryNameURL?.replace(/\s+/g, "-") || "file";
        const randomNum = Math.floor(10 + Math.random() * 90);
        return new File([file], `${slug}-image-${randomNum}.${ext}`, { type: file.type });
    };

    const validationRules = {
        CategoryName: {
            required: true,
            requiredMessage: "Please enter category name."
        },
        CategoryNameURL: {
            required: true,
            requiredMessage: "Please enter category URL."
        },
        SmallDescription: {
            required: true,
            requiredMessage: "Please enter small description."
        },
        CategoryImage: {
            required: !CategoryID,
            requiredMessage: "Please select category image."
        }
    };

    const handleSubmit = async () => {
        // Double-check permission before submitting
        const requiredPermission = CategoryID ? pagePermission.CanWrite : pagePermission.CanAdd;
        if (requiredPermission !== 1) {
            toast.error(`You do not have permission to ${CategoryID ? 'edit' : 'add'} categories`);
            return;
        }

        const errors = validateFields(formData, validationRules);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const data = new FormData();
        data.append("CategoryName", formData.CategoryName);
        data.append("CategoryNameURL", formData.CategoryNameURL);
        data.append("SmallDescription", formData.SmallDescription);
        data.append("DisplayOrder", formData.DisplayOrder);
        data.append("DisplayOnHome", formData.DisplayOnHome ? "1" : "0");
        data.append("DisplayOnHeader", formData.DisplayOnHeader ? "1" : "0");
        data.append("ActiveStatus", formData.ActiveStatus ? "1" : "0");
        data.append("UpdatedBy", "Admin Panel");

        if (formData.CategoryImage instanceof File) {
            data.append("CategoryImage", handleFileRename(formData.CategoryImage));
        } else if (typeof formData.CategoryImage === "string") {
            data.append("CategoryImage", formData.CategoryImage);
        }

        if (CategoryID) {
            data.append("CategoryID", String(CategoryID));
        }

        try {
            const res = await saveOrUpdateCategory(data).unwrap();
            if (res.success) {
                toast.success(res.message);
                router.push("/afford-admin/manage-category");
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
                <h1>{CategoryID ? "Update" : "Add"} Category Data</h1>
                <div className="form-group-row file-uploade-sec" style={{ marginBottom: "15px" }}>
                    <div className="form-group">
                        <label>*Category Name</label>
                        <input
                            type="text"
                            value={formData.CategoryName}
                            placeholder="Hospitality"
                            onChange={(e) => {
                                const val = e.target.value;
                                handleInput("CategoryName", val);
                                if (!CategoryID) {
                                    handleInput("CategoryNameURL", generateSlug(val));
                                }
                                setFormErrors(prev => ({ ...prev, CategoryName: "", CategoryNameURL: "" }));
                            }}
                        />
                        {formErrors.CategoryName && <p className="error">{formErrors.CategoryName}</p>}
                    </div>

                    <div className="form-group">
                        <label>*Small Description</label>
                        <input
                            type="text"
                            value={formData.SmallDescription}
                            placeholder="Brief description of the category"
                            onChange={(e) => {
                                handleInput("SmallDescription", e.target.value);
                                setFormErrors(prev => ({ ...prev, SmallDescription: "" }));
                            }}
                        />
                        {formErrors.SmallDescription && <p className="error">{formErrors.SmallDescription}</p>}
                    </div>
                    <div className="form-group" style={{ width: "25%" }}>
                        <label>*Category Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleInput("CategoryImage", file);
                                if (file) {
                                    setPreviewImage(URL.createObjectURL(file));
                                }
                                setFormErrors(prev => ({ ...prev, CategoryImage: "" }));
                            }}
                        />
                        <span className="hint-text">(Image Size 35 × 47 px)</span>
                        {formErrors.CategoryImage && <p className="error">{formErrors.CategoryImage}</p>}
                    </div>
                    {previewImage && (
                        <img src={previewImage} alt="Category Preview" width={50} />
                    )}

                    <div className="form-group" style={{ display: "none" }}>
                        <label>*Category URL</label>
                        <input
                            type="text"
                            placeholder="hospitality"
                            value={formData.CategoryNameURL}
                            onChange={(e) => {
                                handleInput("CategoryNameURL", e.target.value);
                                setFormErrors(prev => ({ ...prev, CategoryNameURL: "" }));
                            }}
                        />
                        {formErrors.CategoryNameURL && <p className="error">{formErrors.CategoryNameURL}</p>}
                    </div>
                </div>
                <div className="form-group-row" style={{ marginBottom: "15px" }}>
                    <div className="form-group displayorder">
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
                    <div className="form-group-row statusac">
                        <input
                            type="checkbox"
                            id="chkDisplayOnHome"
                            checked={formData.DisplayOnHome}
                            onChange={(e) => handleInput("DisplayOnHome", e.target.checked)}
                        />
                        <label htmlFor="chkDisplayOnHome">Display On Home (Yes/No)</label>
                    </div>

                    <div className="form-group-row statusac">
                        <input
                            type="checkbox"
                            id="chkDisplayOnHeader"
                            checked={formData.DisplayOnHeader}
                            onChange={(e) => handleInput("DisplayOnHeader", e.target.checked)}
                        />
                        <label htmlFor="chkDisplayOnHeader">Display On Header (Yes/No)</label>
                    </div>
                </div>
                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? "Saving..." : "Submit"}
                </button>

                <Link href="/afford-admin/manage-category" className="back-btn">
                    Back
                </Link>
            </div>
        </main>
    );
}