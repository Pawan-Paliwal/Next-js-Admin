'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import nextDynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';
const SunEditor = nextDynamic(() => import('suneditor-react'), { ssr: false });
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
    useGetProductByIdQuery,
    useSaveOrUpdateProductMutation,
    useGetHighlightsByProductQuery,
    useSaveOrUpdateHighlightMutation,
    useDeleteHighlightMutation,
    useGetGalleryByProductQuery,
    useSaveOrUpdateGalleryMutation,
    useDeleteGalleryMutation,
    useGetCircuitsByProductQuery,
    useSaveOrUpdateCircuitMutation,
    useDeleteCircuitMutation,
    useGetTechnologyByProductQuery,
    useSaveOrUpdateTechnologyMutation,
    useDeleteTechnologyMutation,
    useGetDrivesByProductQuery,
    useSaveOrUpdateDriveMutation,
    useDeleteDriveMutation,
    useGetMaxDisplayOrderQuery,
} from "@/store/backendSlice/productAPISlice";
import { usePagePermission } from "../usePagePermission";

const TAB_LIST = [
    { id: "tab-product", label: "Product" },
    { id: "tab-highlights", label: "Highlights" },
    { id: "tab-gallery", label: "Gallery" },
    { id: "tab-circuits", label: "Circuits" },
    { id: "tab-technology", label: "Technology" },
    { id: "tab-drives", label: "Drives" },
];

const FullPageLoader = () => (
    <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.8)", backdropFilter: "blur(4px)",
    }}>
        <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100% { transform:scale(1); opacity:0.3; } 50% { transform:scale(1.2); opacity:0.6; } }
            .cp-spin { width:80px; height:80px; border-radius:50%; border-top:4px solid #f18021; border-right:2px solid #065e87; animation:spin 1.2s linear infinite; }
            .cp-pulse { position:absolute; width:32px; height:32px; background:rgba(0,142,150,0.2); border-radius:50%; animation:pulse 2s ease-in-out infinite; }
        `}</style>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", width: "128px", height: "128px", borderRadius: "50%", backgroundColor: "rgba(0,142,150,0.1)", filter: "blur(24px)" }} />
            <div className="cp-spin" />
            <div className="cp-pulse" />
        </div>
        <p style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(0,0,0,0.8)", margin: "32px 0 0" }}>Please wait…</p>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "6px", background: "linear-gradient(to right,#065e87,#f18021,#065e87)", opacity: 0.4 }} />
    </div>
);


const thStyle = { padding: "8px", border: "1px solid #ddd", background: "#f1f1f1", textAlign: "left" };
const tdStyle = { padding: "8px", border: "1px solid #ddd", verticalAlign: "middle" };


const SectionCard = ({ title, children }) => (
    <div style={{ background: "#f9f9f9", border: "1px solid #e5e5e5", borderRadius: "8px", padding: "16px 20px", marginTop: "18px" }}>
        <h3 style={{ margin: "0 0 0px", fontSize: "20px", fontWeight: 600, color: "#333" }}>{title}</h3>
        <hr style={{ marginBottom: "20px", marginTop: "0px", borderColor: "#ddd" }} />
        {children}
    </div>
);


const getFileType = (url) => {
    if (!url) return "image";
    const ext = url.split(".").pop().toLowerCase();
    return ["mp4", "webm", "ogg", "mov"].includes(ext) ? "video" : "image";
};

const MediaPreview = ({ src }) => {
    if (!src) return null;
    return (
        <div style={{ display: "flex", alignItems: "center", marginTop: "8px" }}>
            {getFileType(src) === "video"
                ? <video src={src} width={100} height={100} controls style={{ objectFit: "cover", borderRadius: "4px" }} />
                : <img src={src} alt="preview" width={80} style={{ borderRadius: "4px" }} />}
        </div>
    );
};



const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 20 20">
        <g fill="currentColor">
            <path fillRule="evenodd" d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z" clipRule="evenodd" />
            <path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z" />
        </g>
    </svg>
);
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
        <path fill="currentColor" d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z" />
    </svg>
);

export default function AddUpdProduct() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ProductId = searchParams.get("ID");

    const [activeTab, setActiveTab] = useState("tab-product");
    const [isProcessing, setIsProcessing] = useState(false);
    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, {
        refetchOnMountOrArgChange: true, pollingInterval: 10000,
    });
    const pagePermission = usePagePermission(checkData);
    const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

    // Queries
    const { data: productData } = useGetProductByIdQuery(ProductId, { skip: !ProductId, refetchOnMountOrArgChange: true });
    const { data: maxOrderData } = useGetMaxDisplayOrderQuery(undefined, { refetchOnMountOrArgChange: true });
    const { data: highlightsData, refetch: refetchHighlights } = useGetHighlightsByProductQuery(ProductId, { skip: !ProductId });
    const { data: galleryData, refetch: refetchGallery } = useGetGalleryByProductQuery(ProductId, { skip: !ProductId });
    const { data: circuitsData, refetch: refetchCircuits } = useGetCircuitsByProductQuery(ProductId, { skip: !ProductId });
    const { data: technologyData, refetch: refetchTechnology } = useGetTechnologyByProductQuery(ProductId, { skip: !ProductId });
    const { data: drivesData, refetch: refetchDrives } = useGetDrivesByProductQuery(ProductId, { skip: !ProductId });

    // Mutations
    const [saveOrUpdateProduct, { isLoading: isSavingProduct }] = useSaveOrUpdateProductMutation();
    const [saveOrUpdateHighlight] = useSaveOrUpdateHighlightMutation();
    const [deleteHighlight] = useDeleteHighlightMutation();
    const [saveOrUpdateGallery] = useSaveOrUpdateGalleryMutation();
    const [deleteGallery] = useDeleteGalleryMutation();
    const [saveOrUpdateCircuit] = useSaveOrUpdateCircuitMutation();
    const [deleteCircuit] = useDeleteCircuitMutation();
    const [saveOrUpdateTechnology] = useSaveOrUpdateTechnologyMutation();
    const [deleteTechnology] = useDeleteTechnologyMutation();
    const [saveOrUpdateDrive] = useSaveOrUpdateDriveMutation();
    const [deleteDrive] = useDeleteDriveMutation();

    // ─── Product form state ───────────────────────────────────────────────────
    const [productMediaPreview, setProductMediaPreview] = useState("");
    const [section1MediaPreview, setSection1MediaPreview] = useState("");
    const [section3MediaPreview, setSection3MediaPreview] = useState("");
    const [section4MediaPreview, setSection4MediaPreview] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        ProductName: "", ProductNameURL: "", ProductHeading: "",
        ProductListDescription: "", ProductSmallDescription: "", ProductMedia: null,
        Section1Title: "", Section1Description: "", Section1MediaUrl: null,
        Section3Title: "", Section3Description: "", Section3MediaUrl: null,
        Section4Title: "", Section4Description: "", Section4MediaUrl: null,
        Section5Title: "", Section5Description: "",
        Section6Title: "", Section6Description: "",
        ActiveStatus: false, DisplayOnHeader: false, DisplayOrder: "",
        MetaTitle: "", MetaKeywords: "", MetaDescriptions: "", MetaSchema: "",
    });

    // Sub-entity form states
    const [highlightForm, setHighlightForm] = useState({ HighlightId: "", Title: "", DisplayOrder: "", ActiveStatus: false });
    const [highlightErrors, setHighlightErrors] = useState({});
    const [galleryForm, setGalleryForm] = useState({ GalleryId: "", Title: "", ImageUrl: null, DisplayOrder: "", ActiveStatus: false });
    const [galleryPreview, setGalleryPreview] = useState("");
    const [galleryErrors, setGalleryErrors] = useState({});
    const [circuitForm, setCircuitForm] = useState({ CircuitId: "", Description: "", ImageUrl: null, DisplayOrder: "", ActiveStatus: false });
    const [circuitPreview, setCircuitPreview] = useState("");
    const [circuitErrors, setCircuitErrors] = useState({});
    const [technologyForm, setTechnologyForm] = useState({ TechnologyId: "", Title: "", Description: "", DisplayOrder: "", ActiveStatus: false });
    const [technologyErrors, setTechnologyErrors] = useState({});
    const [driveForm, setDriveForm] = useState({ DriveId: "", Title: "", Tagline: "", Description: "", IconImage: null, DefaultImage: null, DisplayOrder: "", ActiveStatus: false });
    const [drivePreview, setDrivePreview] = useState("");
    const [driveDefaultPreview, setDriveDefaultPreview] = useState("");
    const [driveErrors, setDriveErrors] = useState({});

    // ─── Guards ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) router.push("/chanderpur-admin/login");
    }, [isSuccess, checkData, router]);

    useEffect(() => {
        if (isPermissionsReady) {
            const required = ProductId ? pagePermission.CanWrite : pagePermission.CanAdd;
            if (required !== 1) {
                toast.error(`You do not have permission to ${ProductId ? "edit" : "add"} product`);
                router.push("/chanderpur-admin/manage-product");
            }
        }
    }, [isPermissionsReady, pagePermission, ProductId, router]);

    // ─── Populate form ────────────────────────────────────────────────────────
    useEffect(() => {
        if (productData?.success) {
            const d = productData.data;
            setFormData({
                ProductName: d.ProductName || "", ProductNameURL: d.ProductNameURL || "",
                ProductHeading: d.ProductHeading || "", ProductListDescription: d.ProductListDescription || "",
                ProductSmallDescription: d.ProductSmallDescription || "", ProductMedia: null,
                Section1Title: d.Section1Title || "", Section1Description: d.Section1Description || "", Section1MediaUrl: null,
                Section3Title: d.Section3Title || "", Section3Description: d.Section3Description || "", Section3MediaUrl: null,
                Section4Title: d.Section4Title || "", Section4Description: d.Section4Description || "", Section4MediaUrl: null,
                Section5Title: d.Section5Title || "", Section5Description: d.Section5Description || "",
                Section6Title: d.Section6Title || "", Section6Description: d.Section6Description || "",
                ActiveStatus: !!d.ActiveStatus, DisplayOnHeader: !!d.DisplayOnHeader,
                DisplayOrder: d.DisplayOrder || "",
                MetaTitle: d.MetaTitle || "", MetaKeywords: d.MetaKeywords || "",
                MetaDescriptions: d.MetaDescriptions || "", MetaSchema: d.MetaSchema || "",
            });
            if (d.ProductMedia) setProductMediaPreview(`/OnlineImages/ProductImages/${d.ProductMedia}`);
            if (d.Section1MediaUrl) setSection1MediaPreview(`/OnlineImages/ProductImages/${d.Section1MediaUrl}`);
            if (d.Section3MediaUrl) setSection3MediaPreview(`/OnlineImages/ProductImages/${d.Section3MediaUrl}`);
            if (d.Section4MediaUrl) setSection4MediaPreview(`/OnlineImages/ProductImages/${d.Section4MediaUrl}`);
        } else if (!ProductId && maxOrderData?.maxOrder !== undefined) {
            setFormData((prev) => ({ ...prev, DisplayOrder: maxOrderData.maxOrder + 1 }));
        }
    }, [productData, maxOrderData]);

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const handleInput = (field, value) => {
        setFormData(p => ({ ...p, [field]: value }));
        setFormErrors(p => ({ ...p, [field]: "" }));
    };
    const generateSlug = (text) =>
        text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
    const handleFileRename = (file, suffix) => {
        if (!file) return null;
        const ext = file.name.split(".").pop();
        const first = file.name.split(/[\s._-]/)[0];
        const rand = Math.floor(10 + Math.random() * 90);
        return new File([file], `${first}${suffix}_${rand}.${ext}`, { type: file.type });
    };

    // ─── Product validate & submit ────────────────────────────────────────────
    const validateProduct = () => {
        const errors = {};
        if (!formData.ProductName?.trim()) errors.ProductName = "Product name is required";
        if (!formData.ProductNameURL?.trim()) errors.ProductNameURL = "Product URL is required";
        if (!formData.ProductListDescription?.trim()) errors.ProductListDescription = "List description is required";
        if (!ProductId && !formData.ProductMedia) errors.ProductMedia = "Product media is required";
        if (ProductId && !formData.ProductMedia && !productMediaPreview) errors.ProductMedia = "Product media is required";
        if (!formData.Section1Title?.trim()) errors.Section1Title = "Section 1 title is required";
        if (!formData.Section1Description?.trim()) errors.Section1Description = "Section 1 description is required";
        if (!ProductId && !formData.Section1MediaUrl) errors.Section1MediaUrl = "Section 1 media is required";
        if (ProductId && !formData.Section1MediaUrl && !section1MediaPreview) errors.Section1MediaUrl = "Section 1 media is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleProductSubmit = async () => {
        const required = ProductId ? pagePermission?.CanWrite : pagePermission?.CanAdd;
        if (required !== 1) { toast.error("You do not have permission"); return; }
        if (!validateProduct()) { toast.error("Please fix the errors before submitting"); return; }
        setIsProcessing(true);
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if ((key.includes("MediaUrl") || key === "ProductMedia") && value instanceof File) {
                data.append(key, handleFileRename(value, `-${key.toLowerCase()}`));
            } else if (key === "ActiveStatus" || key === "DisplayOnHeader") {
                data.append(key, value ? "1" : "0");
            } else if (value !== null && value !== undefined) {
                data.append(key, value.toString());
            }
        });
        if (ProductId) data.append("ProductId", ProductId);
        try {
            const res = await saveOrUpdateProduct(data).unwrap();
            if (res.success) {
                toast.success("Product saved successfully!");
                router.push("/chanderpur-admin/manage-product");
            } else toast.error(res.message || "Save failed");
        } catch { toast.error("An unexpected error occurred"); }
        finally { setIsProcessing(false); }
    };

    // ─── Highlight ────────────────────────────────────────────────────────────
    const validateHighlight = () => {
        const errors = {};
        if (!highlightForm.Title?.trim()) errors.Title = "Title is required";
        setHighlightErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleHighlightSubmit = async () => {
        if (!validateHighlight()) return;
        try {
            const res = await saveOrUpdateHighlight({
                ...(highlightForm.HighlightId && { HighlightId: highlightForm.HighlightId }),
                ProductId, Title: highlightForm.Title,
                DisplayOrder: highlightForm.DisplayOrder || 0,
                ActiveStatus: highlightForm.ActiveStatus ? 1 : 0,
            }).unwrap();
            if (res.success) {
                toast.success(res.message || "Highlight saved!");
                setHighlightForm({ HighlightId: "", Title: "", DisplayOrder: "", ActiveStatus: false });
                refetchHighlights();
            } else toast.error(res.message || "Failed to save highlight");
        } catch { toast.error("Error saving highlight"); }
    };
    const handleHighlightEdit = (item) =>
        setHighlightForm({ HighlightId: item.HighlightId, Title: item.Title, DisplayOrder: item.DisplayOrder, ActiveStatus: !!item.ActiveStatus });
    const handleHighlightDelete = async (id) => {
        if (!confirm("Delete this highlight?")) return;
        try {
            const res = await deleteHighlight(id).unwrap();
            if (res.success) { toast.success("Deleted!"); refetchHighlights(); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting"); }
    };

    // ─── Gallery ──────────────────────────────────────────────────────────────
    const validateGallery = () => {
        const errors = {};
        if (!galleryForm.Title?.trim()) errors.Title = "Title is required";
        if (!galleryForm.GalleryId && !galleryForm.ImageUrl) errors.ImageUrl = "Image is required";
        setGalleryErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleGallerySubmit = async () => {
        if (!validateGallery()) return;
        const data = new FormData();
        if (galleryForm.GalleryId) data.append("GalleryId", galleryForm.GalleryId);
        data.append("ProductId", ProductId);
        data.append("Title", galleryForm.Title);
        data.append("DisplayOrder", galleryForm.DisplayOrder || 0);
        data.append("ActiveStatus", galleryForm.ActiveStatus ? 1 : 0);
        if (galleryForm.ImageUrl instanceof File) data.append("ImageUrl", handleFileRename(galleryForm.ImageUrl, "-gallery"));
        try {
            const res = await saveOrUpdateGallery(data).unwrap();
            if (res.success) {
                toast.success(res.message || "Gallery saved!");
                setGalleryForm({ GalleryId: "", Title: "", ImageUrl: null, DisplayOrder: "", ActiveStatus: false });
                setGalleryPreview(""); refetchGallery();
            } else toast.error(res.message || "Failed");
        } catch { toast.error("Error saving gallery item"); }
    };
    const handleGalleryEdit = (item) => {
        setGalleryForm({ GalleryId: item.GalleryId, Title: item.Title, ImageUrl: null, DisplayOrder: item.DisplayOrder, ActiveStatus: !!item.ActiveStatus });
        setGalleryPreview(item.ImageUrl ? `/OnlineImages/ProductImages/${item.ImageUrl}` : "");
    };
    const handleGalleryDelete = async (id) => {
        if (!confirm("Delete this gallery item?")) return;
        try {
            const res = await deleteGallery(id).unwrap();
            if (res.success) { toast.success("Deleted!"); refetchGallery(); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting"); }
    };

    // ─── Circuit ──────────────────────────────────────────────────────────────
    const validateCircuit = () => {
        const errors = {};
        if (!circuitForm.Description?.trim()) errors.Description = "Description is required";
        if (!circuitForm.CircuitId && !circuitForm.ImageUrl) errors.ImageUrl = "Image is required";
        setCircuitErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleCircuitSubmit = async () => {
        if (!validateCircuit()) return;
        const data = new FormData();
        if (circuitForm.CircuitId) data.append("CircuitId", circuitForm.CircuitId);
        data.append("ProductId", ProductId);
        data.append("Description", circuitForm.Description);
        data.append("DisplayOrder", circuitForm.DisplayOrder || 0);
        data.append("ActiveStatus", circuitForm.ActiveStatus ? 1 : 0);
        if (circuitForm.ImageUrl instanceof File) data.append("ImageUrl", handleFileRename(circuitForm.ImageUrl, "-circuit"));
        try {
            const res = await saveOrUpdateCircuit(data).unwrap();
            if (res.success) {
                toast.success(res.message || "Circuit saved!");
                setCircuitForm({ CircuitId: "", Description: "", ImageUrl: null, DisplayOrder: "", ActiveStatus: false });
                setCircuitPreview(""); refetchCircuits();
            } else toast.error(res.message || "Failed");
        } catch { toast.error("Error saving circuit"); }
    };
    const handleCircuitEdit = (item) => {
        setCircuitForm({ CircuitId: item.CircuitId, Description: item.Description, ImageUrl: null, DisplayOrder: item.DisplayOrder, ActiveStatus: !!item.ActiveStatus });
        setCircuitPreview(item.ImageUrl ? `/OnlineImages/ProductImages/${item.ImageUrl}` : "");
    };
    const handleCircuitDelete = async (id) => {
        if (!confirm("Delete this circuit?")) return;
        try {
            const res = await deleteCircuit(id).unwrap();
            if (res.success) { toast.success("Deleted!"); refetchCircuits(); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting"); }
    };

    // ─── Technology ───────────────────────────────────────────────────────────
    const validateTechnology = () => {
        const errors = {};
        if (!technologyForm.Title?.trim()) errors.Title = "Title is required";
        if (!technologyForm.Description?.trim()) errors.Description = "Description is required";
        setTechnologyErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleTechnologySubmit = async () => {
        if (!validateTechnology()) return;
        try {
            const res = await saveOrUpdateTechnology({
                ...(technologyForm.TechnologyId && { TechnologyId: technologyForm.TechnologyId }),
                ProductId, Title: technologyForm.Title, Description: technologyForm.Description,
                DisplayOrder: technologyForm.DisplayOrder || 0,
                ActiveStatus: technologyForm.ActiveStatus ? 1 : 0,
            }).unwrap();
            if (res.success) {
                toast.success(res.message || "Technology saved!");
                setTechnologyForm({ TechnologyId: "", Title: "", Description: "", DisplayOrder: "", ActiveStatus: false });
                refetchTechnology();
            } else toast.error(res.message || "Failed");
        } catch { toast.error("Error saving technology"); }
    };
    const handleTechnologyEdit = (item) =>
        setTechnologyForm({ TechnologyId: item.TechnologyId, Title: item.Title, Description: item.Description, DisplayOrder: item.DisplayOrder, ActiveStatus: !!item.ActiveStatus });
    const handleTechnologyDelete = async (id) => {
        if (!confirm("Delete this technology?")) return;
        try {
            const res = await deleteTechnology(id).unwrap();
            if (res.success) { toast.success("Deleted!"); refetchTechnology(); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting"); }
    };

    // ─── Drive ────────────────────────────────────────────────────────────────
    const validateDrive = () => {
        const errors = {};
        if (!driveForm.Title?.trim()) errors.Title = "Title is required";
        if (!driveForm.DriveId && !driveForm.IconImage) errors.IconImage = "Icon image is required";
        if (!driveForm.DriveId && !driveForm.DefaultImage) errors.DefaultImage = "Default image is required";
        setDriveErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleDriveSubmit = async () => {
        if (!validateDrive()) return;
        const data = new FormData();
        if (driveForm.DriveId) data.append("DriveId", driveForm.DriveId);
        data.append("ProductId", ProductId);
        data.append("Title", driveForm.Title);
        data.append("Tagline", driveForm.Tagline || "");
        data.append("Description", driveForm.Description || "");
        data.append("DisplayOrder", driveForm.DisplayOrder || 0);
        data.append("ActiveStatus", driveForm.ActiveStatus ? 1 : 0);
        if (driveForm.IconImage instanceof File) data.append("IconImage", handleFileRename(driveForm.IconImage, "-drive"));
        if (driveForm.DefaultImage instanceof File) data.append("DefaultImage", handleFileRename(driveForm.DefaultImage, "-drive-default"));
        try {
            const res = await saveOrUpdateDrive(data).unwrap();
            if (res.success) {
                toast.success(res.message || "Drive saved!");
                setDriveForm({ DriveId: "", Title: "", Tagline: "", Description: "", IconImage: null, DefaultImage: null, DisplayOrder: "", ActiveStatus: false });
                setDrivePreview("");
                setDriveDefaultPreview("");
                refetchDrives();
            } else toast.error(res.message || "Failed");
        } catch { toast.error("Error saving drive"); }
    };
    const handleDriveEdit = (item) => {
        setDriveForm({ DriveId: item.DriveId, Title: item.Title, Tagline: item.Tagline || "", Description: item.Description || "", IconImage: null, DefaultImage: null, DisplayOrder: item.DisplayOrder, ActiveStatus: !!item.ActiveStatus });
        setDrivePreview(item.IconImage ? `/OnlineImages/ProductImages/${item.IconImage}` : "");
        setDriveDefaultPreview(item.DefaultImage ? `/OnlineImages/ProductImages/${item.DefaultImage}` : "");
    };
    const handleDriveDelete = async (id) => {
        if (!confirm("Delete this drive?")) return;
        try {
            const res = await deleteDrive(id).unwrap();
            if (res.success) { toast.success("Deleted!"); refetchDrives(); }
            else toast.error("Failed to delete");
        } catch { toast.error("Error deleting"); }
    };

    // ─── Derived ──────────────────────────────────────────────────────────────
    const canEdit = pagePermission?.CanWrite === 1;
    const canDelete = pagePermission?.CanDelete === 1;
    const isGlobalLoading = isProcessing || isSavingProduct;

    const availableTabs = TAB_LIST.filter(t =>
        t.id === "tab-product" ? true : !!ProductId
    );

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {isGlobalLoading && <FullPageLoader />}

            <main className="add_update container">
                <div className="form-box">
                    <h1>{ProductId ? "Update" : "Add"} Product</h1>
                    <div className="tabbing_sec">
                        <div style={{ display: "flex" }}>
                            <ul className="tab-nav">
                                {availableTabs.map(t => (
                                    <li
                                        key={t.id}
                                        onClick={() => setActiveTab(t.id)}
                                        className={activeTab === t.id ? "active" : ""}
                                    >
                                        {t.label}
                                    </li>
                                ))}
                            </ul>
                            <ul className="tab-nav" style={{ width: "220px", marginLeft: "auto" }}>
                                <div className="submit-back-container" style={{ display: "flex", gap: "10px" }}>
                                    <button
                                        className="back-btn"
                                        onClick={() => router.push("/chanderpur-admin/manage-product")}
                                        style={{ padding: "10px 15px", marginTop: "0px" }}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="submit-btn"
                                        onClick={handleProductSubmit}
                                        disabled={isGlobalLoading}
                                        style={{ padding: "10px 15px", marginTop: "0px" }}
                                    >
                                        {isGlobalLoading ? "Please wait…" : "Submit"}
                                    </button>
                                </div>
                            </ul>
                        </div>
                        <div className="tab-nav-content">
                            <div className={`tabs ${activeTab === "tab-product" ? "active" : ""}`}>

                                {/* Basic info row */}
                                <div className="form-group-row" style={{ display: "flex", gap: "10px" }}>
                                    <div className="form-group" style={{ flex: "0 0 24%" }}>
                                        <label>Product Name*</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Smart Health Plan"
                                            value={formData.ProductName}
                                            className={formErrors.ProductName ? "error-input" : ""}
                                            onChange={e => {
                                                handleInput("ProductName", e.target.value);
                                                if (!ProductId) {
                                                    handleInput("ProductNameURL", generateSlug(e.target.value));
                                                    handleInput("MetaTitle", `${e.target.value} | Chanderpur Group`);
                                                }
                                            }}
                                        />
                                        {formErrors.ProductName && <p className="error">{formErrors.ProductName}</p>}
                                    </div>
                                    <div className="form-group" style={{ flex: "0 0 24%" }}>
                                        <label>Product URL*</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., smart-health-plan"
                                            value={formData.ProductNameURL}
                                            className={formErrors.ProductNameURL ? "error-input" : ""}
                                            onChange={e => handleInput("ProductNameURL", e.target.value)}
                                        />
                                        {formErrors.ProductNameURL && <p className="error">{formErrors.ProductNameURL}</p>}
                                    </div>
                                    <div className="form-group" style={{ flex: "0 0 24%" }}>
                                        <label>Product Heading</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Heading text"
                                            value={formData.ProductHeading}
                                            onChange={e => handleInput("ProductHeading", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Product Media*</label>
                                        <input
                                            type="file" accept="image/*,video/*"
                                            className={formErrors.ProductMedia ? "error-input" : ""}
                                            onChange={e => {
                                                const file = e.target.files?.[0] || null;
                                                handleInput("ProductMedia", file);
                                                if (file) setProductMediaPreview(URL.createObjectURL(file));
                                            }}
                                        />
                                        {formErrors.ProductMedia && <p className="error">{formErrors.ProductMedia}</p>}
                                    </div>
                                    <MediaPreview src={productMediaPreview} />

                                </div>

                                <div className="form-group-row" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>List Description*</label>
                                        <div style={{ width: "100%", backgroundColor: "#fff" }}>
                                            <SunEditor
                                                lang="en"
                                                name="ProductListDescription"
                                                width="100%"
                                                height="110px"
                                                setContents={formData.ProductListDescription || ""}
                                                onChange={(content) => handleInput("ProductListDescription", content)}
                                            />
                                        </div>
                                        {formErrors.ProductListDescription && <p className="error">{formErrors.ProductListDescription}</p>}
                                    </div>
                                </div>

                                {/* Status checkboxes */}
                                <div style={{ display: "flex", gap: "24px", marginTop: "18px", flexWrap: "wrap" }}>
                                    <div className="form-group" style={{ flex: 1, maxWidth: "600px" }}>
                                        <label>Small Description</label>
                                        <input
                                            type="text"
                                            value={formData.ProductSmallDescription || ""}
                                            onChange={(e) => handleInput("ProductSmallDescription", e.target.value)}
                                            placeholder="Enter small description"
                                        />
                                    </div>
                                    <div className="form-group displayorder" style={{ flex: "0 0 24%" }}>
                                        <label>Display Order</label>
                                        <input
                                            type="number" placeholder="0" min="0"
                                            value={formData.DisplayOrder}
                                            onChange={e => handleInput("DisplayOrder", e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                                        <input type="checkbox" id="chkActive" checked={formData.ActiveStatus}
                                            onChange={e => handleInput("ActiveStatus", e.target.checked)} />
                                        <label htmlFor="chkActive" style={{ margin: 0 }}>Active Status</label>
                                    </div>
                                    <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                                        <input type="checkbox" id="chkHeader" checked={formData.DisplayOnHeader}
                                            onChange={e => handleInput("DisplayOnHeader", e.target.checked)} />
                                        <label htmlFor="chkHeader" style={{ margin: 0 }}>Display On Header</label>
                                    </div>
                                </div>

                                {/* Section 1 */}
                                <SectionCard title="Section 1">
                                    <div className="form-group-row" style={{ display: "flex", gap: "10px" }}>
                                        <div className="form-group">
                                            <label>Title*</label>
                                            <input type="text" placeholder="Section 1 Title"
                                                value={formData.Section1Title}
                                                className={formErrors.Section1Title ? "error-input" : ""}
                                                onChange={e => handleInput("Section1Title", e.target.value)} />
                                            {formErrors.Section1Title && <p className="error">{formErrors.Section1Title}</p>}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description*</label>
                                        <div style={{ width: "100%", backgroundColor: "#fff" }}>
                                            <SunEditor
                                                lang="en"
                                                name="Section1Description"
                                                width="100%"
                                                height="110px"
                                                setContents={formData.Section1Description || ""}
                                                onChange={(content) => handleInput("Section1Description", content)}
                                            />
                                        </div>
                                        {formErrors.Section1Description && <p className="error">{formErrors.Section1Description}</p>}
                                    </div>
                                    <div className="form-group-row file-uploade-sec" style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "8px" }}>
                                        <div className="colA" style={{ flex: "0 0 40%" }}>
                                            <div className="form-group">
                                                <label>Media*</label>
                                                <input type="file" accept="image/*,video/*"
                                                    className={formErrors.Section1MediaUrl ? "error-input" : ""}
                                                    onChange={e => { const f = e.target.files?.[0] || null; handleInput("Section1MediaUrl", f); if (f) setSection1MediaPreview(URL.createObjectURL(f)); }} />
                                                {formErrors.Section1MediaUrl && <p className="error">{formErrors.Section1MediaUrl}</p>}
                                            </div>
                                            <MediaPreview src={section1MediaPreview} />
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* Section 3 */}
                                <SectionCard title="Section 3">
                                    <div className="form-group-row" style={{ display: "flex", gap: "10px" }}>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input type="text" placeholder="Section 3 Title"
                                                value={formData.Section3Title}
                                                onChange={e => handleInput("Section3Title", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <div style={{ width: "100%", backgroundColor: "#fff" }}>
                                            <SunEditor
                                                lang="en"
                                                name="Section3Description"
                                                width="100%"
                                                height="110px"
                                                setContents={formData.Section3Description || ""}
                                                onChange={(content) => handleInput("Section3Description", content)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group-row file-uploade-sec" style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginTop: "8px" }}>
                                        <div className="colA" style={{ flex: "0 0 40%" }}>
                                            <div className="form-group">
                                                <label>Media</label>
                                                <input type="file" accept="image/*,video/*"
                                                    onChange={e => { const f = e.target.files?.[0] || null; handleInput("Section3MediaUrl", f); if (f) setSection3MediaPreview(URL.createObjectURL(f)); }} />
                                            </div>
                                            <MediaPreview src={section3MediaPreview} />
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* Section 4 */}
                                <SectionCard title="Section 4">
                                    <div className="form-group-row" style={{ display: "flex", gap: "10px" }}>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input type="text" placeholder="Section 4 Title"
                                                value={formData.Section4Title}
                                                onChange={e => handleInput("Section4Title", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <div style={{ width: "100%", backgroundColor: "#fff" }}>
                                            <SunEditor
                                                lang="en"
                                                name="Section4Description"
                                                width="100%"
                                                height="110px"
                                                setContents={formData.Section4Description || ""}
                                                onChange={(content) => handleInput("Section4Description", content)}
                                            />
                                        </div>
                                    </div>

                                </SectionCard>

                                {/* Section 5 */}
                                <SectionCard title="Section 5">
                                    <div className="form-group-row" style={{ display: "flex", gap: "10px" }}>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input type="text" placeholder="Section 5 Title"
                                                value={formData.Section5Title}
                                                onChange={e => handleInput("Section5Title", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <div style={{ width: "100%", backgroundColor: "#fff" }}>
                                            <SunEditor
                                                lang="en"
                                                name="Section5Description"
                                                width="100%"
                                                height="110px"
                                                setContents={formData.Section5Description || ""}
                                                onChange={(content) => handleInput("Section5Description", content)}
                                            />
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* Section 6 */}
                                <SectionCard title="Section 6 / Form Section">
                                    <div className="form-group-row" style={{ display: "flex", gap: "10px" }}>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input type="text" placeholder="e.g., Get Started Today"
                                                value={formData.Section6Title}
                                                onChange={e => handleInput("Section6Title", e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <div style={{ width: "100%", backgroundColor: "#fff" }}>
                                            <SunEditor
                                                lang="en"
                                                name="Section6Description"
                                                width="100%"
                                                height="110px"
                                                setContents={formData.Section6Description || ""}
                                                onChange={(content) => handleInput("Section6Description", content)}
                                            />
                                        </div>
                                    </div>
                                </SectionCard>

                                {/* SEO */}
                                <h2 style={{ marginTop: "28px" }}>Only for SEO Purpose</h2>
                                <hr />
                                {[
                                    { field: "MetaTitle", label: "Meta Title" },
                                    { field: "MetaKeywords", label: "Meta Keywords" },
                                    { field: "MetaDescriptions", label: "Meta Descriptions" },
                                    { field: "MetaSchema", label: "Meta Schema" },
                                ].map(({ field, label }) => (
                                    <div className="form-group" key={field}>
                                        <label className="block-label">{label}</label>
                                        <input type="text" value={formData[field]}
                                            onChange={e => handleInput(field, e.target.value)} />
                                    </div>
                                ))}

                                {/* Bottom action row */}
                                <div className="submit-back-container" style={{ display: "flex", gap: "10px", marginTop: "24px", justifyContent: "flex-start" }}>
                                    <button className="back-btn" onClick={() => router.push("/chanderpur-admin/manage-product")} style={{ margin: "0px" }}>Back</button>
                                    <button className="submit-btn" onClick={handleProductSubmit} disabled={isGlobalLoading} style={{ marginTop: 0 }}>
                                        {isGlobalLoading ? "Please wait…" : "Submit"}
                                    </button>
                                </div>
                            </div>

                            {/* ════════════════════════════════════════════
                                TAB 2 – Highlights
                            ════════════════════════════════════════════ */}
                            <div className={`tabs ${activeTab === "tab-highlights" ? "active" : ""}`}>
                                <h2 style={{ margin: 0, fontSize: "18px" }}>
                                    {highlightForm.HighlightId ? "Edit Highlight" : "Add Highlight"}
                                </h2>
                                <hr />
                                <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e5e5e5", borderRadius: "6px", background: "#fafafa" }}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                        <div className="form-group" style={{ flex: 1.5, maxWidth: "500px" }}>
                                            <label>Title*</label>
                                            <input
                                                type="text"
                                                placeholder="Highlight title"
                                                value={highlightForm.Title}
                                                className={highlightErrors.Title ? "error-input" : ""}
                                                onChange={e => setHighlightForm(p => ({ ...p, Title: e.target.value }))}
                                            />
                                            {highlightErrors.Title && <p className="error">{highlightErrors.Title}</p>}
                                        </div>
                                        <div className="form-group displayorder" style={{ flex: "0 0 120px" }}>
                                            <label>Display Order</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                min="0"
                                                value={highlightForm.DisplayOrder}
                                                onChange={e => setHighlightForm(p => ({ ...p, DisplayOrder: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, paddingBottom: "6px" }}>
                                            <input
                                                type="checkbox"
                                                id="hlActive"
                                                checked={highlightForm.ActiveStatus}
                                                onChange={e => setHighlightForm(p => ({ ...p, ActiveStatus: e.target.checked }))}
                                            />
                                            <label htmlFor="hlActive" style={{ margin: 0 }}>Active Status</label>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                        {canEdit && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#065e87", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={handleHighlightSubmit}
                                            >
                                                {highlightForm.HighlightId ? "Update" : "Add"} Highlight
                                            </button>
                                        )}
                                        {highlightForm.HighlightId && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={() => setHighlightForm({ HighlightId: "", Title: "", DisplayOrder: "", ActiveStatus: false })}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h2 style={{ fontSize: "18px" }}>Highlights List</h2>
                                <hr />
                                {highlightsData?.data?.length > 0 ? (
                                    <table style={{ width: "50%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                {["Title", "Order", "Status", ...(canEdit || canDelete ? ["Actions"] : [])].map(h => (
                                                    <th key={h} style={thStyle}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {highlightsData.data.map(item => (
                                                <tr key={item.HighlightId}>
                                                    <td style={tdStyle} title={item.Title}>
                                                        {item.Title?.length > 50 ? item.Title.slice(0, 50) + "..." : item.Title}
                                                    </td>
                                                    <td style={tdStyle}>{item.DisplayOrder}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{ color: item.ActiveStatus ? "green" : "red" }}>
                                                            {item.ActiveStatus ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    {(canEdit || canDelete) && (
                                                        <td style={tdStyle}>
                                                            {canEdit && <button className="edit-icon" onClick={() => handleHighlightEdit(item)}><EditIcon /></button>}
                                                            {canDelete && <button className="edit-icon" onClick={() => handleHighlightDelete(item.HighlightId)}><DeleteIcon /></button>}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No highlights found</p>
                                )}
                            </div>

                            {/* ════════════════════════════════════════════
                                TAB 3 – Gallery
                            ════════════════════════════════════════════ */}
                            <div className={`tabs ${activeTab === "tab-gallery" ? "active" : ""}`}>
                                <h2 style={{ margin: 0, fontSize: "18px" }}>
                                    {galleryForm.GalleryId ? "Edit Gallery Item" : "Add Gallery Item"}
                                </h2>
                                <hr />
                                <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e5e5e5", borderRadius: "6px", background: "#fafafa" }}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                        <div className="form-group" style={{ flex: 1.5, maxWidth: "500px" }}>
                                            <label>Title*</label>
                                            <input type="text" placeholder="Gallery item title"
                                                value={galleryForm.Title}
                                                className={galleryErrors.Title ? "error-input" : ""}
                                                onChange={e => setGalleryForm(p => ({ ...p, Title: e.target.value }))} />
                                            {galleryErrors.Title && <p className="error">{galleryErrors.Title}</p>}
                                        </div>
                                        <div className="form-group" style={{ flex: 2, maxWidth: "500px" }}>
                                            <label>Image{!galleryForm.GalleryId && "*"}</label>
                                            <input type="file" accept="image/*"
                                                className={galleryErrors.ImageUrl ? "error-input" : ""}
                                                onChange={e => { const f = e.target.files?.[0] || null; setGalleryForm(p => ({ ...p, ImageUrl: f })); if (f) setGalleryPreview(URL.createObjectURL(f)); }} />
                                            {galleryErrors.ImageUrl && <p className="error">{galleryErrors.ImageUrl}</p>}
                                        </div>
                                        {galleryPreview && (
                                            <div style={{ flex: "0 0 60px" }}>
                                                <img src={galleryPreview} alt="preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />
                                            </div>
                                        )}
                                        <div className="form-group displayorder" style={{ flex: "0 0 120px" }}>
                                            <label>Display Order</label>
                                            <input type="number" placeholder="0" min="0"
                                                value={galleryForm.DisplayOrder}
                                                onChange={e => setGalleryForm(p => ({ ...p, DisplayOrder: e.target.value }))} />
                                        </div>
                                        <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, paddingBottom: "6px" }}>
                                            <input type="checkbox" id="galActive" checked={galleryForm.ActiveStatus}
                                                onChange={e => setGalleryForm(p => ({ ...p, ActiveStatus: e.target.checked }))} />
                                            <label htmlFor="galActive" style={{ margin: 0 }}>Active Status</label>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                        {canEdit && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#065e87", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={handleGallerySubmit}
                                            >
                                                {galleryForm.GalleryId ? "Update" : "Add"} Gallery Item
                                            </button>
                                        )}
                                        {galleryForm.GalleryId && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={() => { setGalleryForm({ GalleryId: "", Title: "", ImageUrl: null, DisplayOrder: "", ActiveStatus: false }); setGalleryPreview(""); }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h2 style={{ fontSize: "18px" }}>Gallery List</h2>
                                <hr />
                                {galleryData?.data?.length > 0 ? (
                                    <table style={{ width: "50%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                {["Image", "Title", "Order", "Status", ...(canEdit || canDelete ? ["Actions"] : [])].map(h => (
                                                    <th key={h} style={thStyle}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {galleryData.data.map(item => (
                                                <tr key={item.GalleryId}>
                                                    <td style={tdStyle}>
                                                        {item.ImageUrl && (
                                                            <img src={`/OnlineImages/ProductImages/${item.ImageUrl}`} width={50}
                                                                style={{ borderRadius: "4px" }}
                                                                onError={e => { e.target.style.display = "none"; }} />
                                                        )}
                                                    </td>
                                                    <td style={tdStyle}>{item.Title}</td>
                                                    <td style={tdStyle}>{item.DisplayOrder}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{ color: item.ActiveStatus ? "green" : "red" }}>
                                                            {item.ActiveStatus ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    {(canEdit || canDelete) && (
                                                        <td style={tdStyle}>
                                                            {canEdit && <button className="edit-icon" onClick={() => handleGalleryEdit(item)}><EditIcon /></button>}
                                                            {canDelete && <button className="edit-icon" onClick={() => handleGalleryDelete(item.GalleryId)}><DeleteIcon /></button>}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No gallery items found</p>
                                )}
                            </div>

                            {/* ════════════════════════════════════════════
                                TAB 4 – Circuits
                            ════════════════════════════════════════════ */}
                            <div className={`tabs ${activeTab === "tab-circuits" ? "active" : ""}`}>
                                <h2 style={{ margin: 0, fontSize: "18px" }}>
                                    {circuitForm.CircuitId ? "Edit Circuit" : "Add Circuit"}
                                </h2>
                                <hr />
                                <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e5e5e5", borderRadius: "6px", background: "#fafafa" }}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                        <div className="form-group" style={{ flex: 1.5, maxWidth: "500px" }}>
                                            <label>Description*</label>
                                            <input type="text" placeholder="Circuit description"
                                                value={circuitForm.Description}
                                                className={circuitErrors.Description ? "error-input" : ""}
                                                onChange={e => setCircuitForm(p => ({ ...p, Description: e.target.value }))} />
                                            {circuitErrors.Description && <p className="error">{circuitErrors.Description}</p>}
                                        </div>
                                        <div className="form-group" style={{ flex: 2, maxWidth: "500px" }}>
                                            <label>Image{!circuitForm.CircuitId && "*"}</label>
                                            <input type="file" accept="image/*"
                                                className={circuitErrors.ImageUrl ? "error-input" : ""}
                                                onChange={e => { const f = e.target.files?.[0] || null; setCircuitForm(p => ({ ...p, ImageUrl: f })); if (f) setCircuitPreview(URL.createObjectURL(f)); }} />
                                            {circuitErrors.ImageUrl && <p className="error">{circuitErrors.ImageUrl}</p>}
                                        </div>
                                        {circuitPreview && (
                                            <div style={{ flex: "0 0 60px" }}>
                                                <img src={circuitPreview} alt="preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />
                                            </div>
                                        )}
                                        <div className="form-group displayorder" style={{ flex: "0 0 120px" }}>
                                            <label>Display Order</label>
                                            <input type="number" placeholder="0" min="0"
                                                value={circuitForm.DisplayOrder}
                                                onChange={e => setCircuitForm(p => ({ ...p, DisplayOrder: e.target.value }))} />
                                        </div>
                                        <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, paddingBottom: "6px" }}>
                                            <input type="checkbox" id="circActive" checked={circuitForm.ActiveStatus}
                                                onChange={e => setCircuitForm(p => ({ ...p, ActiveStatus: e.target.checked }))} />
                                            <label htmlFor="circActive" style={{ margin: 0 }}>Active Status</label>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                        {canEdit && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#065e87", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={handleCircuitSubmit}
                                            >
                                                {circuitForm.CircuitId ? "Update" : "Add"} Circuit
                                            </button>
                                        )}
                                        {circuitForm.CircuitId && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={() => { setCircuitForm({ CircuitId: "", Description: "", ImageUrl: null, DisplayOrder: "", ActiveStatus: false }); setCircuitPreview(""); }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h2 style={{ fontSize: "18px" }}>Circuits List</h2>
                                <hr />
                                {circuitsData?.data?.length > 0 ? (
                                    <table style={{ width: "60%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                {["Image", "Description", "Order", "Status", ...(canEdit || canDelete ? ["Actions"] : [])].map(h => (
                                                    <th key={h} style={thStyle}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {circuitsData.data.map(item => (
                                                <tr key={item.CircuitId}>
                                                    <td style={tdStyle}>
                                                        {item.ImageUrl && (
                                                            <img src={`/OnlineImages/ProductImages/${item.ImageUrl}`} width={50}
                                                                style={{ borderRadius: "4px" }}
                                                                onError={e => { e.target.style.display = "none"; }} />
                                                        )}
                                                    </td>
                                                    <td style={tdStyle}>{item.Description}</td>
                                                    <td style={tdStyle}>{item.DisplayOrder}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{ color: item.ActiveStatus ? "green" : "red" }}>
                                                            {item.ActiveStatus ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    {(canEdit || canDelete) && (
                                                        <td style={tdStyle}>
                                                            {canEdit && <button className="edit-icon" onClick={() => handleCircuitEdit(item)}><EditIcon /></button>}
                                                            {canDelete && <button className="edit-icon" onClick={() => handleCircuitDelete(item.CircuitId)}><DeleteIcon /></button>}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No circuits found</p>
                                )}
                            </div>

                            {/* ════════════════════════════════════════════
                                TAB 5 – Technology
                            ════════════════════════════════════════════ */}
                            <div className={`tabs ${activeTab === "tab-technology" ? "active" : ""}`}>
                                <h2 style={{ margin: 0, fontSize: "18px" }}>
                                    {technologyForm.TechnologyId ? "Edit Technology" : "Add Technology"}
                                </h2>
                                <hr />
                                <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e5e5e5", borderRadius: "6px", background: "#fafafa" }}>

                                    {/* Row 1: Title, Display Order, Active Status */}
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                        <div className="form-group" style={{ flex: 1.5, maxWidth: "500px" }}>
                                            <label>Title*</label>
                                            <input
                                                type="text"
                                                placeholder="Technology title"
                                                value={technologyForm.Title}
                                                className={technologyErrors.Title ? "error-input" : ""}
                                                onChange={e => setTechnologyForm(p => ({ ...p, Title: e.target.value }))}
                                            />
                                            {technologyErrors.Title && <p className="error">{technologyErrors.Title}</p>}
                                        </div>
                                        <div className="form-group displayorder" style={{ flex: "0 0 120px" }}>
                                            <label>Display Order</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                min="0"
                                                value={technologyForm.DisplayOrder}
                                                onChange={e => setTechnologyForm(p => ({ ...p, DisplayOrder: e.target.value }))}
                                            />
                                        </div>
                                        <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, paddingBottom: "6px" }}>
                                            <input
                                                type="checkbox"
                                                id="techActive"
                                                checked={technologyForm.ActiveStatus}
                                                onChange={e => setTechnologyForm(p => ({ ...p, ActiveStatus: e.target.checked }))}
                                            />
                                            <label htmlFor="techActive" style={{ margin: 0 }}>Active Status</label>
                                        </div>
                                    </div>

                                    {/* Row 2: Description (SunEditor) - full width */}
                                    <div className="form-group" style={{ marginTop: "10px", width: "100%" }}>
                                        <label>Description*</label>
                                        <SunEditor
                                            setContents={technologyForm.Description} height="120px"
                                            onChange={value => setTechnologyForm(p => ({ ...p, Description: value }))}
                                        />
                                        {technologyErrors.Description && <p className="error">{technologyErrors.Description}</p>}
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                        {canEdit && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#008e96", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={handleTechnologySubmit}
                                            >
                                                {technologyForm.TechnologyId ? "Update" : "Add"} Technology
                                            </button>
                                        )}
                                        {technologyForm.TechnologyId && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={() => setTechnologyForm({ TechnologyId: "", Title: "", Description: "", DisplayOrder: "", ActiveStatus: false })}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h2 style={{ fontSize: "18px" }}>Technology List</h2>
                                <hr />
                                {technologyData?.data?.length > 0 ? (
                                    <table style={{ width: "60%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                {["Title", "Description", "Order", "Status", ...(canEdit || canDelete ? ["Actions"] : [])].map(h => (
                                                    <th key={h} style={thStyle}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {technologyData.data.map(item => (
                                                <tr key={item.TechnologyId}>
                                                    <td style={tdStyle}>{item.Title}</td>
                                                    <td style={tdStyle}>
                                                        <span dangerouslySetInnerHTML={{ __html: item.Description?.length > 80 ? item.Description.slice(0, 80) + "..." : item.Description }} />
                                                    </td>
                                                    <td style={tdStyle}>{item.DisplayOrder}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{ color: item.ActiveStatus ? "green" : "red" }}>
                                                            {item.ActiveStatus ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    {(canEdit || canDelete) && (
                                                        <td style={tdStyle}>
                                                            {canEdit && <button className="edit-icon" onClick={() => handleTechnologyEdit(item)}><EditIcon /></button>}
                                                            {canDelete && <button className="edit-icon" onClick={() => handleTechnologyDelete(item.TechnologyId)}><DeleteIcon /></button>}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No technology items found</p>
                                )}
                            </div>
                            {/* ════════════════════════════════════════════
                                TAB 6 – Drives
                            ════════════════════════════════════════════ */}
                            <div className={`tabs ${activeTab === "tab-drives" ? "active" : ""}`}>
                                <h2 style={{ margin: 0, fontSize: "18px" }}>
                                    {driveForm.DriveId ? "Edit Drive" : "Add Drive"}
                                </h2>
                                <hr />
                                <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #e5e5e5", borderRadius: "6px", background: "#fafafa" }}>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Title*</label>
                                            <input type="text" placeholder="Drive title"
                                                value={driveForm.Title}
                                                className={driveErrors.Title ? "error-input" : ""}
                                                onChange={e => setDriveForm(p => ({ ...p, Title: e.target.value }))} />
                                            {driveErrors.Title && <p className="error">{driveErrors.Title}</p>}
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Tagline</label>
                                            <input type="text" placeholder="Short tagline"
                                                value={driveForm.Tagline}
                                                onChange={e => setDriveForm(p => ({ ...p, Tagline: e.target.value }))} />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label>Description</label>
                                            <input type="text" placeholder="Drive description"
                                                value={driveForm.Description}
                                                onChange={e => setDriveForm(p => ({ ...p, Description: e.target.value }))} />
                                        </div>
                                        <div className="form-group" style={{ flex: 1.5 }}>
                                            <label>Icon Image{!driveForm.DriveId && "*"}</label>
                                            <input type="file" accept="image/*"
                                                className={driveErrors.IconImage ? "error-input" : ""}
                                                onChange={e => { const f = e.target.files?.[0] || null; setDriveForm(p => ({ ...p, IconImage: f })); if (f) setDrivePreview(URL.createObjectURL(f)); }} />
                                            {driveErrors.IconImage && <p className="error">{driveErrors.IconImage}</p>}
                                        </div>
                                        {drivePreview && (
                                            <div style={{ flex: "0 0 56px" }}>
                                                <img src={drivePreview} alt="icon preview" height={40} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />
                                            </div>
                                        )}

                                    </div>
                                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                                        <div className="form-group" style={{ flex: 1.5, maxWidth: "200px" }}>
                                            <label>Default Image{!driveForm.DriveId && "*"}</label>
                                            <input type="file" accept="image/*"
                                                className={driveErrors.DefaultImage ? "error-input" : ""}
                                                onChange={e => { const f = e.target.files?.[0] || null; setDriveForm(p => ({ ...p, DefaultImage: f })); if (f) setDriveDefaultPreview(URL.createObjectURL(f)); }} />
                                            {driveErrors.DefaultImage && <p className="error">{driveErrors.DefaultImage}</p>}
                                        </div>
                                        {driveDefaultPreview && (
                                            <div style={{ flex: "0 0 56px" }}>
                                                <img src={driveDefaultPreview} alt="default preview" height={40} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />
                                            </div>
                                        )}
                                        <div className="form-group displayorder" style={{ flex: "0 0 120px" }}>
                                            <label>Display Order</label>
                                            <input type="number" placeholder="0" min="0"
                                                value={driveForm.DisplayOrder}
                                                onChange={e => setDriveForm(p => ({ ...p, DisplayOrder: e.target.value }))} />
                                        </div>
                                        <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, paddingBottom: "6px" }}>
                                            <input type="checkbox" id="driveActive" checked={driveForm.ActiveStatus}
                                                onChange={e => setDriveForm(p => ({ ...p, ActiveStatus: e.target.checked }))} />
                                            <label htmlFor="driveActive" style={{ margin: 0 }}>Active</label>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                        {canEdit && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#065e87", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={handleDriveSubmit}
                                            >
                                                {driveForm.DriveId ? "Update" : "Add"} Drive
                                            </button>
                                        )}
                                        {driveForm.DriveId && (
                                            <button
                                                style={{ padding: "6px 14px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                                                onClick={() => { setDriveForm({ DriveId: "", Title: "", Tagline: "", Description: "", IconImage: null, DisplayOrder: "", ActiveStatus: false }); setDrivePreview(""); }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h2 style={{ fontSize: "18px" }}>Drives List</h2>
                                <hr />
                                {drivesData?.data?.length > 0 ? (
                                    <table style={{ width: "60%", borderCollapse: "collapse" }}>
                                        <thead>
                                            <tr>
                                                {["Icon", "Title", "Tagline", "Order", "Status", ...(canEdit || canDelete ? ["Actions"] : [])].map(h => (
                                                    <th key={h} style={thStyle}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {drivesData.data.map(item => (
                                                <tr key={item.DriveId}>
                                                    <td style={tdStyle}>
                                                        {item.IconImage && (
                                                            <img src={`/OnlineImages/ProductImages/${item.DefaultImage}`} width={40}
                                                                style={{ borderRadius: "4px" }}
                                                                onError={e => { e.target.style.display = "none"; }} />
                                                        )}
                                                    </td>
                                                    <td style={tdStyle}>{item.Title}</td>
                                                    <td style={tdStyle}>{item.Tagline}</td>
                                                    <td style={tdStyle}>{item.DisplayOrder}</td>
                                                    <td style={tdStyle}>
                                                        <span style={{ color: item.ActiveStatus ? "green" : "red" }}>
                                                            {item.ActiveStatus ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    {(canEdit || canDelete) && (
                                                        <td style={tdStyle}>
                                                            {canEdit && <button className="edit-icon" onClick={() => handleDriveEdit(item)}><EditIcon /></button>}
                                                            {canDelete && <button className="edit-icon" onClick={() => handleDriveDelete(item.DriveId)}><DeleteIcon /></button>}
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>No drives found</p>
                                )}
                            </div>

                        </div>{/* /tab-nav-content */}
                    </div>{/* /tabbing_sec */}
                </div>{/* /form-box */}
            </main>
        </>
    );
}