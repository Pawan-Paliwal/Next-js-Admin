'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "../../../../store/backendSlice/authAPISlice";
import { useGetCaseStudyByIdQuery, useSaveOrUpdateCaseStudyMutation, } from "@/store/backendSlice/caseStudyApiSlice";
import { useGetActiveProductsQuery } from "@/store/backendSlice/productAPISlice";
import SunEditor from "@/components/backendcomponents/SunEditor";
import Loader from "@/app/loading";
import { usePagePermission } from "../usePagePermission";

export default function AddUpdCaseStudy() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const CaseStudyId = searchParams.get("ID");
    const [openProducts, setOpenProducts] = useState(false);
    const dropdownRef = useRef(null);

    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
    const pagePermission = usePagePermission(checkData);
    const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;
    const { data: caseStudyData } = useGetCaseStudyByIdQuery(CaseStudyId, { skip: !CaseStudyId, refetchOnMountOrArgChange: true });
    const { data: productsData } = useGetActiveProductsQuery();
    const [saveOrUpdateCaseStudy, { isLoading }] = useSaveOrUpdateCaseStudyMutation();



    const [caseStudyImagePreview, setCaseStudyImagePreview] = useState("");
    const [stat1MediaPreview, setStat1MediaPreview] = useState("");
    const [stat2MediaPreview, setStat2MediaPreview] = useState("");
    const [stat3MediaPreview, setStat3MediaPreview] = useState("");
    const [section1MediaPreview, setSection1MediaPreview] = useState("");
    const [section2MediaPreview, setSection2MediaPreview] = useState("");
    const [section3MediaPreview, setSection3MediaPreview] = useState("");
    const [section4MediaPreview, setSection4MediaPreview] = useState("");

    const [formErrors, setFormErrors] = useState({});

    const [formData, setFormData] = useState({
        CaseStudyProducts: [],
        CaseStudyName: "",
        CaseStudyNameURL: "",
        CaseStudyDescription: "",
        CaseStudyImage: null,
        ButtonText: "",
        Box1Title: "",
        Box1Description: "",
        Box1Media: null,
        Box2Title: "",
        Box2Description: "",
        Box2Media: null,
        Box3Title: "",
        Box3Description: "",
        Box3Media: null,
        Section1Title: "",
        Section1Subtitle: "",
        Section1Description: "",
        Section1ButtonText: "",
        Section1MediaUrl: null,
        Section2Title: "",
        Section2Subtitle: "",
        Section2Description: "",
        Section2MediaUrl: null,
        Section3Title: "",
        Section3Subtitle: "",
        Section3Description: "",
        Section3MediaUrl: null,
        Section4Title: "",
        Section4Subtitle: "",
        Section4Description: "",
        Section4MediaUrl: null,
        ActiveStatus: false,
        MetaTitle: "",
        MetaKeywords: "",
        MetaDescriptions: "",
        MetaSchema: "",
    });

    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/afford-admin/login");
        }
    }, [isSuccess, checkData, router]);

    useEffect(() => {
        if (isPermissionsReady) {
            const requiredPermission = CaseStudyId ? pagePermission.CanWrite : pagePermission.CanAdd;
            if (requiredPermission !== 1) {
                toast.error(`You do not have permission to ${CaseStudyId ? 'edit' : 'add'}`);
                router.push("/afford-admin/manage-casestudy");
            }
        }
    }, [isPermissionsReady, pagePermission, CaseStudyId, router]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenProducts(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        if (caseStudyData?.success) {
            const data = caseStudyData.data;
            setFormData({
                CaseStudyProducts: data.CaseStudyProducts || [],
                CaseStudyName: data.CaseStudyName || "",
                CaseStudyNameURL: data.CaseStudyNameURL || "",
                CaseStudyDescription: data.CaseStudyDescription || "",
                CaseStudyImage: null,
                ButtonText: data.ButtonText || "",
                Box1Title: data.Box1Title || "",
                Box1Description: data.Box1Description || "",
                Box1Media: null,
                Box2Title: data.Box2Title || "",
                Box2Description: data.Box2Description || "",
                Box2Media: null,
                Box3Title: data.Box3Title || "",
                Box3Description: data.Box3Description || "",
                Box3Media: null,
                Section1Title: data.Section1Title || "",
                Section1Subtitle: data.Section1Subtitle || "",
                Section1Description: data.Section1Description || "",
                Section1ButtonText: data.Section1ButtonText || "",
                Section1MediaUrl: null,
                Section2Title: data.Section2Title || "",
                Section2Subtitle: data.Section2Subtitle || "",
                Section2Description: data.Section2Description || "",
                Section2MediaUrl: null,
                Section3Title: data.Section3Title || "",
                Section3Subtitle: data.Section3Subtitle || "",
                Section3Description: data.Section3Description || "",
                Section3MediaUrl: null,
                Section4Title: data.Section4Title || "",
                Section4Subtitle: data.Section4Subtitle || "",
                Section4Description: data.Section4Description || "",
                Section4MediaUrl: null,
                ActiveStatus: data.ActiveStatus === 1 || data.ActiveStatus === true,
                MetaTitle: data.MetaTitle || "",
                MetaKeywords: data.MetaKeywords || "",
                MetaDescriptions: data.MetaDescriptions || "",
                MetaSchema: data.MetaSchema || "",
            });
            const imgPath = "/OnlineImages/CasestudiesImages/";
            setCaseStudyImagePreview(data.CaseStudyImage ? `${imgPath}${data.CaseStudyImage}` : "");
            setStat1MediaPreview(data.Box1Media ? `${imgPath}${data.Box1Media}` : "");
            setStat2MediaPreview(data.Box2Media ? `${imgPath}${data.Box2Media}` : "");
            setStat3MediaPreview(data.Box3Media ? `${imgPath}${data.Box3Media}` : "");
            setSection1MediaPreview(data.Section1MediaUrl ? `${imgPath}${data.Section1MediaUrl}` : "");
            setSection2MediaPreview(data.Section2MediaUrl ? `${imgPath}${data.Section2MediaUrl}` : "");
            setSection3MediaPreview(data.Section3MediaUrl ? `${imgPath}${data.Section3MediaUrl}` : "");
            setSection4MediaPreview(data.Section4MediaUrl ? `${imgPath}${data.Section4MediaUrl}` : "");
        }
    }, [caseStudyData]);

    const handleInput = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setFormErrors((prev) => ({ ...prev, [field]: "" }));
        if (field === "CaseStudyName" && !CaseStudyId) {
            setFormData((prev) => ({ ...prev, MetaTitle: `${value} | Afford Plan` }));
        }
    };

    const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

    const validateForm = () => {
        const errors = {};
        if (!formData.CaseStudyProducts.length)
            errors.CaseStudyProducts = "Select at least one product";
        if (!formData.CaseStudyName?.trim())
            errors.CaseStudyName = "Case Study name is required";
        if (!formData.CaseStudyNameURL?.trim())
            errors.CaseStudyNameURL = "Case Study URL is required";
        if (!formData.CaseStudyDescription?.trim())
            errors.CaseStudyDescription = "Description is required";
        if (!CaseStudyId && !formData.CaseStudyImage)
            errors.CaseStudyImage = "Case Study image is required";
        if (CaseStudyId && !formData.CaseStudyImage && !caseStudyImagePreview)
            errors.CaseStudyImage = "Case Study image is required";
        if (!formData.ButtonText?.trim())
            errors.ButtonText = "Button text is required";
        if (!formData.Box1Description?.trim())
            errors.Box1Description = "Metric 1 label is required";
        if (!CaseStudyId && !formData.Box1Media)
            errors.Box1Media = "Metric 1 icon is required";
        if (CaseStudyId && !formData.Box1Media && !stat1MediaPreview)
            errors.Box1Media = "Metric 1 icon is required";
        if (!formData.Box2Description?.trim())
            errors.Box2Description = "Metric 2 label is required";
        if (!CaseStudyId && !formData.Box2Media)
            errors.Box2Media = "Metric 2 icon is required";
        if (CaseStudyId && !formData.Box2Media && !stat2MediaPreview)
            errors.Box2Media = "Metric 2 icon is required";
        if (!formData.Box3Description?.trim())
            errors.Box3Description = "Metric 3 label is required";
        if (!CaseStudyId && !formData.Box3Media)
            errors.Box3Media = "Metric 3 icon is required";
        if (CaseStudyId && !formData.Box3Media && !stat3MediaPreview)
            errors.Box3Media = "Metric 3 icon is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        const requiredPermission = CaseStudyId ? pagePermission.CanWrite : pagePermission.CanAdd;
        if (requiredPermission !== 1) {
            toast.error(`You do not have permission to ${CaseStudyId ? 'edit' : 'add'} `);
            return;
        }
        if (!validateForm()) {
            const firstError = Object.entries(formErrors).find(([_, value]) => value);
            if (firstError) {
                const [fieldKey, errorMsg] = firstError;
                toast.error(errorMsg);
            }
            return;
        }
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "CaseStudyProducts") { data.append("CaseStudyProducts", JSON.stringify(value)); return; }
            if (value instanceof File) { data.append(key, value); return; }
            if (key === "ActiveStatus") { data.append(key, value ? "1" : "0"); return; }
            if (value !== null && value !== undefined) { data.append(key, value.toString()); }
        });
        if (CaseStudyId) { data.append("CaseStudyId", CaseStudyId); }
        try {
            const res = await saveOrUpdateCaseStudy(data).unwrap();
            if (res.success) {
                toast.success("Case Study saved successfully!");
                router.push("/afford-admin/manage-casestudy");
            } else {
                toast.error(res.message || "Save failed");
            }
        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : String(error));
        }
    };



    const getFileType = (file) => {
        if (file instanceof File) {
            return file.type.startsWith('video/') ? 'video' : 'image';
        }
        if (typeof file === 'string') {
            const ext = file.split('.').pop().toLowerCase();
            return ['mp4', 'webm', 'ogg', 'mov'].includes(ext) ? 'video' : 'image';
        }
        return 'image';
    };

    const renderMediaPreview = (preview, width = 80) => {
        if (!preview) return null;
        if (getFileType(preview) === 'video') {
            return <video src={preview} width={width} controls />;
        }
        return <img src={preview} alt="Preview" width={width} />;
    };

    return (
        <main className="add_update container">
            <div className="form-box">
                <h1>{CaseStudyId ? "Update" : "Add"} Case Study</h1>
                <br />
                <h2>Basic Information</h2>
                <hr />
                <div className="form-group-row">
                    <div className="selectCat form-group">
                        <label>Products *</label>
                        <div
                            className="input_wrap placeholder"
                            onClick={() => setOpenProducts(prev => !prev)}
                        >
                            <input
                                type="text"
                                placeholder="Select Products"
                                value={
                                    formData.CaseStudyProducts.length
                                        ? formData.CaseStudyProducts
                                            .map(id => productsData?.products?.find(p => p.ProductId === id)?.ProductName)
                                            .filter(Boolean)
                                            .join(", ")
                                        : ""
                                }
                                readOnly
                            />
                        </div>
                        <div
                            className={`dropdown__wrap ${openProducts ? "active" : ""}`}
                            ref={dropdownRef}
                        >
                            <div className="dropdown_menu">
                                {(productsData?.products || []).filter(p => p.ProductType === "swasth-for-hospitals").map(p => (
                                    <div className="options" key={p.ProductId}>
                                        <input
                                            id={`prod-${p.ProductId}`}
                                            type="checkbox"
                                            checked={formData.CaseStudyProducts.includes(p.ProductId)}
                                            onChange={(e) => {
                                                const newSelected = e.target.checked
                                                    ? [...formData.CaseStudyProducts, p.ProductId]
                                                    : formData.CaseStudyProducts.filter(id => id !== p.ProductId);
                                                setFormData(prev => ({ ...prev, CaseStudyProducts: newSelected }));
                                                setFormErrors(prev => ({ ...prev, CaseStudyProducts: "" }));
                                            }}
                                        />
                                        <div className="in-bx"></div>
                                        <span>{p.ProductName}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {formErrors.CaseStudyProducts && <p className="error">{formErrors.CaseStudyProducts}</p>}
                    </div>
                    <div className="form-group">
                        <label>Title*</label>
                        <input
                            type="text"
                            placeholder="Revolutionizing Patient Care"
                            value={formData.CaseStudyName}
                            onChange={(e) => {
                                const val = e.target.value;
                                handleInput("CaseStudyName", val);
                                if (!CaseStudyId) {
                                    handleInput("CaseStudyNameURL", generateSlug(val));
                                }
                            }}
                        />
                        {formErrors.CaseStudyName && <p className="error">{formErrors.CaseStudyName}</p>}
                    </div>
                    <div className="form-group">
                        <label>Title URL*</label>
                        <input
                            type="text"
                            placeholder="revolutionizing-patient-care"
                            value={formData.CaseStudyNameURL}
                            onChange={(e) => handleInput("CaseStudyNameURL", e.target.value)}
                        />
                        {formErrors.CaseStudyNameURL && <p className="error">{formErrors.CaseStudyNameURL}</p>}
                    </div>
                </div>
                <div className="form-group-row" style={{ marginTop: "12px" }}>
                    <div className="form-group">
                        <label>Description*</label>
                        <input
                            type="text"
                            placeholder="By implementing our integrated digital health platform."
                            value={formData.CaseStudyDescription}
                            onChange={(e) => handleInput("CaseStudyDescription", e.target.value)}
                        />
                        {formErrors.CaseStudyDescription && <p className="error">{formErrors.CaseStudyDescription}</p>}
                    </div>
                    <div className="form-group">
                        <label>Button Text*</label>
                        <input
                            type="text"
                            placeholder="Read More"
                            value={formData.ButtonText}
                            onChange={(e) => handleInput("ButtonText", e.target.value)}
                        />
                        {formErrors.ButtonText && <p className="error">{formErrors.ButtonText}</p>}
                    </div>
                    <div className="form-group">
                        <label>Media*</label>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                handleInput("CaseStudyImage", file);
                                if (file) setCaseStudyImagePreview(URL.createObjectURL(file));
                            }}
                        />
                        <span className="hint-text">(Image Size 660 × 717 px)</span>
                        {formErrors.CaseStudyImage && <p className="error">{formErrors.CaseStudyImage}</p>}
                    </div>
                    {caseStudyImagePreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(caseStudyImagePreview)}</div>}
                </div>
                <div className="form-group-row" style={{ marginTop: "12px" }}>
                    <div className="form-group-row statusac">
                        <input
                            type="checkbox"
                            id="chkActiveStatus"
                            checked={formData.ActiveStatus}
                            onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
                        />
                        <label htmlFor="chkActiveStatus">Active Status</label>
                    </div>
                </div>
                <div style={{ background: "#d4edda", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
                    <h2 style={{ marginTop: "30px" }}>Key Metrics & Achievements</h2>
                    <hr />
                    <div className="form-group-row">
                        <div className="form-group" style={{ display: "none" }}>
                            <label>Metric 1 Value*</label>
                            <input
                                type="text"
                                placeholder="e.g., 35%"
                                value={formData.Box1Title}
                                onChange={(e) => handleInput("Box1Title", e.target.value)}
                            />
                            {formErrors.Box1Title && <p className="error">{formErrors.Box1Title}</p>}
                        </div>
                        <div className="form-group">
                            <label>Metric 1 Label*</label>
                            <input
                                type="text"
                                placeholder="e.g., Reduction in Patient Wait Times"
                                value={formData.Box1Description}
                                onChange={(e) => handleInput("Box1Description", e.target.value)}
                            />
                            {formErrors.Box1Description && <p className="error">{formErrors.Box1Description}</p>}
                        </div>
                        <div className="form-group">
                            <label>Metric 1 Icon*</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleInput("Box1Media", file);
                                    if (file) setStat1MediaPreview(URL.createObjectURL(file));
                                }}
                            />
                            <span className="hint-text">(Image Size 36 × 36 px)</span>
                            {formErrors.Box1Media && <p className="error">{formErrors.Box1Media}</p>}
                        </div>
                        {stat1MediaPreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(stat1MediaPreview)}</div>}
                    </div>
                    <div className="form-group-row">
                        <div className="form-group" style={{ marginTop: "22px", display: "none" }}>
                            <label>Metric 2 Value*</label>
                            <input
                                type="text"
                                placeholder="e.g., 2x"
                                value={formData.Box2Title}
                                onChange={(e) => handleInput("Box2Title", e.target.value)}
                            />
                            {formErrors.Box2Title && <p className="error">{formErrors.Box2Title}</p>}
                        </div>
                        <div className="form-group" style={{ marginTop: "22px" }}>
                            <label>Metric 2 Label*</label>
                            <input
                                type="text"
                                placeholder="e.g., Increase in Appointments"
                                value={formData.Box2Description}
                                onChange={(e) => handleInput("Box2Description", e.target.value)}
                            />
                            {formErrors.Box2Description && <p className="error">{formErrors.Box2Description}</p>}
                        </div>
                        <div className="form-group" style={{ marginTop: "22px" }}>
                            <label>Metric 2 Icon*</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleInput("Box2Media", file);
                                    if (file) setStat2MediaPreview(URL.createObjectURL(file));
                                }}
                            />
                            <span className="hint-text">(Image Size 36 × 36 px)</span>
                            {formErrors.Box2Media && <p className="error">{formErrors.Box2Media}</p>}
                        </div>
                        {stat2MediaPreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(stat2MediaPreview)}</div>}
                    </div>
                    <div className="form-group-row">
                        <div className="form-group" style={{ marginTop: "22px", marginBottom: "22px", display: "none" }}>
                            <label>Metric 3 Value*</label>
                            <input
                                type="text"
                                placeholder="e.g., 20%"
                                value={formData.Box3Title}
                                onChange={(e) => handleInput("Box3Title", e.target.value)}
                            />
                            {formErrors.Box3Title && <p className="error">{formErrors.Box3Title}</p>}
                        </div>
                        <div className="form-group" style={{ marginTop: "22px", marginBottom: "22px" }}>
                            <label>Metric 3 Label*</label>
                            <input
                                type="text"
                                placeholder="e.g., Improvement in Treatment Adherence"
                                value={formData.Box3Description}
                                onChange={(e) => handleInput("Box3Description", e.target.value)}
                            />
                            {formErrors.Box3Description && <p className="error">{formErrors.Box3Description}</p>}
                        </div>
                        <div className="form-group" style={{ marginTop: "22px", marginBottom: "22px" }}>
                            <label>Metric 3 Icon*</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleInput("Box3Media", file);
                                    if (file) setStat3MediaPreview(URL.createObjectURL(file));
                                }}
                            />
                            <span className="hint-text">(Image Size 36 × 36 px)</span>
                            {formErrors.Box3Media && <p className="error">{formErrors.Box3Media}</p>}
                        </div>
                        {stat3MediaPreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(stat3MediaPreview)}</div>}
                    </div>
                </div>
                <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
                    <h2 style={{ marginTop: "30px" }}>Section 1</h2>
                    <hr />
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="Enhancing Chronic"
                                value={formData.Section1Title}
                                onChange={(e) => handleInput("Section1Title", e.target.value)}
                            />
                            {formErrors.Section1Title && <p className="error">{formErrors.Section1Title}</p>}
                        </div>
                        <div className="form-group">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                placeholder="Disease Management"
                                value={formData.Section1Subtitle}
                                onChange={(e) => handleInput("Section1Subtitle", e.target.value)}
                            />
                            {formErrors.Section1Subtitle && <p className="error">{formErrors.Section1Subtitle}</p>}
                        </div>
                        <div className="form-group">
                            <label>Button Text</label>
                            <input
                                type="text"
                                placeholder="Book a demo"
                                value={formData.Section1ButtonText}
                                onChange={(e) => handleInput("Section1ButtonText", e.target.value)}
                            />
                            {formErrors.Section1ButtonText && <p className="error">{formErrors.Section1ButtonText}</p>}
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Media</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleInput("Section1MediaUrl", file);
                                    if (file) setSection1MediaPreview(URL.createObjectURL(file));
                                }}
                            />
                            <span className="hint-text">(Image Size 1500 × 1000 px)</span>
                            {formErrors.Section1MediaUrl && <p className="error">{formErrors.Section1MediaUrl}</p>}
                        </div>
                        {section1MediaPreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(section1MediaPreview)}</div>}
                    </div>
                    <div className="form-group" style={{ flex: 1, marginTop: "22px", marginBottom: "22px" }}>
                        <label>Description</label>
                        <input
                            type="text"
                            placeholder="By implementing our integrated digital health platform, we improved patient engagement."
                            value={formData.Section1Description}
                            onChange={(e) => handleInput("Section1Description", e.target.value)}
                        />
                        {formErrors.Section1Description && <p className="error">{formErrors.Section1Description}</p>}
                    </div>
                </div>
                <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
                    <h2 style={{ marginTop: "30px" }}>Section 2</h2>
                    <hr />
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="The Challenge "
                                value={formData.Section2Title}
                                onChange={(e) => handleInput("Section2Title", e.target.value)}
                            />
                            {formErrors.Section2Title && <p className="error">{formErrors.Section2Title}</p>}
                        </div>
                        <div className="form-group">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                placeholder="Apex Healthcare"
                                value={formData.Section2Subtitle}
                                onChange={(e) => handleInput("Section2Subtitle", e.target.value)}
                            />
                            {formErrors.Section2Subtitle && <p className="error">{formErrors.Section2Subtitle}</p>}
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Media</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleInput("Section2MediaUrl", file);
                                    if (file) setSection2MediaPreview(URL.createObjectURL(file));
                                }}
                            />
                            <span className="hint-text">(Image Size 525 × 325 px)</span>
                            {formErrors.Section2MediaUrl && <p className="error">{formErrors.Section2MediaUrl}</p>}
                        </div>
                        {section2MediaPreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(section2MediaPreview)}</div>}
                    </div>
                    <div className="form-group-row" style={{ alignItems: "flex-start" }}>
                        <div className="form-group" style={{ flex: 1, marginTop: "22px", marginBottom: "22px" }}>
                            <label>Description</label>
                            <SunEditor
                                value={formData.Section2Description || ""}
                                onChange={(val) => {
                                    handleInput("Section2Description", val);
                                    setFormErrors(prev => ({ ...prev, Section2Description: "" }));
                                }}
                                setOptions={{
                                    height: 200,
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["bold", "underline", "italic"],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list"],
                                        ["link"],
                                        ["removeFormat"]
                                    ]
                                }}
                            />
                            {formErrors.Section2Description && (
                                <p className="error">{formErrors.Section2Description}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
                    <h2 style={{ marginTop: "30px" }}>Section 3</h2>
                    <hr />
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="The Solution"
                                value={formData.Section3Title}
                                onChange={(e) => handleInput("Section3Title", e.target.value)}
                            />
                            {formErrors.Section3Title && <p className="error">{formErrors.Section3Title}</p>}
                        </div>
                        <div className="form-group">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                placeholder="Address these"
                                value={formData.Section3Subtitle}
                                onChange={(e) => handleInput("Section3Subtitle", e.target.value)}
                            />
                            {formErrors.Section3Subtitle && <p className="error">{formErrors.Section3Subtitle}</p>}
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Media</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleInput("Section3MediaUrl", file);
                                    if (file) setSection3MediaPreview(URL.createObjectURL(file));
                                }}
                            />
                            <span className="hint-text">(Image Size 525 × 350 px)</span>
                            {formErrors.Section3MediaUrl && <p className="error">{formErrors.Section3MediaUrl}</p>}
                        </div>
                        {section3MediaPreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(section3MediaPreview)}</div>}
                    </div>
                    <div className="form-group-row" style={{ alignItems: "flex-start" }}>
                        <div className="form-group" style={{ flex: 1, marginTop: "22px", marginBottom: "22px" }}>
                            <label>Description</label>
                            <SunEditor
                                value={formData.Section3Description || ""}
                                onChange={(val) => {
                                    handleInput("Section3Description", val);
                                    setFormErrors(prev => ({ ...prev, Section3Description: "" }));
                                }}
                                setOptions={{
                                    height: 200,
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["bold", "underline", "italic"],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list"],
                                        ["link"],
                                        ["removeFormat"]
                                    ]
                                }}
                            />
                            {formErrors.Section3Description && (
                                <p className="error">{formErrors.Section3Description}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
                    <h2 style={{ marginTop: "30px" }}>Section 4</h2>
                    <hr />
                    <div className="form-group-row">
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                placeholder="Key "
                                value={formData.Section4Title}
                                onChange={(e) => handleInput("Section4Title", e.target.value)}
                            />
                            {formErrors.Section4Title && <p className="error">{formErrors.Section4Title}</p>}
                        </div>
                        <div className="form-group">
                            <label>Subtitle</label>
                            <input
                                type="text"
                                placeholder="Results"
                                value={formData.Section4Subtitle}
                                onChange={(e) => handleInput("Section4Subtitle", e.target.value)}
                            />
                            {formErrors.Section4Subtitle && <p className="error">{formErrors.Section4Subtitle}</p>}
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Media</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleInput("Section4MediaUrl", file);
                                    if (file) setSection4MediaPreview(URL.createObjectURL(file));
                                }}
                            />
                            <span className="hint-text">(Image Size 1008 × 782 px)</span>
                            {formErrors.Section4MediaUrl && <p className="error">{formErrors.Section4MediaUrl}</p>}
                        </div>
                        {section4MediaPreview && <div style={{ display: "flex", alignItems: "center" }}>{renderMediaPreview(section4MediaPreview)}</div>}
                    </div>
                    <div className="form-group-row" style={{ alignItems: "flex-start" }}>
                        <div className="form-group" style={{ flex: 1, marginTop: "22px", marginBottom: "22px" }}>
                            <label>Description</label>
                            <SunEditor
                                value={formData.Section4Description || ""}
                                onChange={(val) => {
                                    handleInput("Section4Description", val);
                                    setFormErrors(prev => ({ ...prev, Section4Description: "" }));
                                }}
                                setOptions={{
                                    height: 200,
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["bold", "underline", "italic"],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list"],
                                        ["link"],
                                        ["removeFormat"]
                                    ]
                                }}
                            />
                            {formErrors.Section4Description && (
                                <p className="error">{formErrors.Section4Description}</p>
                            )}
                        </div>
                    </div>
                </div>
                <div style={{ background: "#ebebeb", padding: "1px 21px", borderRadius: "17px", marginTop: "19px" }}>
                    <h2 style={{ marginTop: "30px" }}>SEO</h2>
                    <hr />
                    <div className="form-group">
                        <label>Meta Title</label>
                        <input
                            type="text"
                            placeholder="Enter meta title"
                            value={formData.MetaTitle}
                            onChange={(e) => handleInput("MetaTitle", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Meta Keywords</label>
                        <input
                            type="text"
                            placeholder="Enter meta keywords"
                            value={formData.MetaKeywords}
                            onChange={(e) => handleInput("MetaKeywords", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Meta Descriptions</label>
                        <input
                            type="text"
                            placeholder="Enter meta descriptions"
                            value={formData.MetaDescriptions}
                            onChange={(e) => handleInput("MetaDescriptions", e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Meta Schema</label>
                        <input
                            type="text"
                            placeholder="Enter meta schema"
                            value={formData.MetaSchema}
                            onChange={(e) => handleInput("MetaSchema", e.target.value)}
                        />
                    </div>
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading && <Loader />} Submit
                </button>
                <Link href="/afford-admin/manage-casestudy" className="back-btn">Back</Link>
            </div>
        </main>
    );
}