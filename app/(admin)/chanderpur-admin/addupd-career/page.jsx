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
    useGetCareerByIdQuery,
    useSaveOrUpdateCareerMutation
} from "@/store/backendSlice/careerAPISlice";
import { usePagePermission } from "../usePagePermission";
import Loader from "@/app/loading";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdCareerData() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const CareerID = searchParams.get("ID");

    const { data: checkData, isSuccess } = useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true, pollingInterval: 10000 });
    const pagePermission = usePagePermission(checkData);
    const isPermissionsReady = checkData?.loggedIn && pagePermission?.PageID !== 0;

    const { data: careerData } = useGetCareerByIdQuery(CareerID, { skip: !CareerID, refetchOnMountOrArgChange: true });
    const [saveOrUpdateCareer, { isLoading }] = useSaveOrUpdateCareerMutation();

    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        CareerName: "",
        CareerDescription: "",
        Location: "",
        CareerType: "Full-time",
        DisplayOrder: 1,
        ActiveStatus: true
    });

    useEffect(() => {
        if (isSuccess && !checkData?.loggedIn) {
            router.push("/chanderpur-admin/login");
        }
    }, [isSuccess, checkData, router]);

    useEffect(() => {
        if (isPermissionsReady) {
            const requiredPermission = CareerID ? pagePermission.CanWrite : pagePermission.CanAdd;
            if (requiredPermission !== 1) {
                toast.error(`You do not have permission to ${CareerID ? 'edit' : 'add'} career data`);
                router.push("/chanderpur-admin/manage-career");
            }
        }
    }, [isPermissionsReady, pagePermission, CareerID, router]);

    useEffect(() => {
        if (careerData?.success) {
            const data = careerData.data;
            setFormData({
                CareerName: data.CareerName || "",
                CareerDescription: data.CareerDescription || "",
                Location: data.Location || "",
                CareerType: data.CareerType || "Full-time",
                DisplayOrder: data.DisplayOrder ?? 1,
                ActiveStatus: data.ActiveStatus === 1
            });
        }
    }, [careerData]);

    const handleInput = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFormErrors(prev => ({ ...prev, [field]: "" }));
    };

    const validationRules = {
        CareerName: { required: true, requiredMessage: "Please enter a job title." },
        Location: { required: true, requiredMessage: "Please enter location." },
        CareerType: { required: true, requiredMessage: "Please enter career type." },
        CareerDescription: { required: true, requiredMessage: "Please enter description." }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        const requiredPermission = CareerID ? pagePermission.CanWrite : pagePermission.CanAdd;
        if (requiredPermission !== 1) {
            toast.error(`You do not have permission to ${CareerID ? 'edit' : 'add'} career data`);
            return;
        }

        const errors = validateFields(formData, validationRules);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error("Please fill all required fields");
            return;
        }
        setFormErrors({});

        const submitData = {
            ...formData,
            ActiveStatus: formData.ActiveStatus ? 1 : 0,
            UpdatedBy: "Admin Panel"
        };
        if (CareerID) submitData.CareerID = CareerID;

        try {
            const res = await saveOrUpdateCareer(submitData).unwrap();
            if (res.success) {
                toast.success(res.message);
                router.push("/chanderpur-admin/manage-career");
            } else {
                toast.error(res.message || "Failed to save");
            }
        } catch (error) {
            toast.error("An error occurred during save");
        }
    };

    const editorOptions = {
        buttonList: [
            ['undo', 'redo'],
            ['font', 'fontSize', 'formatBlock'],
            ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
            ['removeFormat'], '/',
            ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
            ['link', 'image', 'video'],
            ['fullScreen', 'showBlocks', 'codeView'],
            ['preview', 'print']
        ],
        minHeight: "250px"
    };

    return (
        <main className="add_update container">
            <div className="form-box">
                <h1>{CareerID ? "Update" : "Add"} Career Data</h1>

                <div className="tabbing_sec">
                    <div className="tab-nav-content">
                        <div style={{ paddingBottom: "15px" }}>

                            <div className="form-group-row update-form">
                                <div className="form-group">
                                    <label>Job Title*</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Mechanical Engineer"
                                        value={formData.CareerName}
                                        onChange={(e) => handleInput("CareerName", e.target.value)}
                                    />
                                    {formErrors.CareerName && <p className="error">{formErrors.CareerName}</p>}
                                </div>
                                <div className="form-group">
                                    <label>Location*</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Yamuna Nagar, Haryana"
                                        value={formData.Location}
                                        onChange={(e) => handleInput("Location", e.target.value)}
                                    />
                                    {formErrors.Location && <p className="error">{formErrors.Location}</p>}
                                </div>
                                <div className="form-group">
                                    <label>Career Type*</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Full-time"
                                        value={formData.CareerType}
                                        onChange={(e) => handleInput("CareerType", e.target.value)}
                                    />
                                    {formErrors.CareerType && <p className="error">{formErrors.CareerType}</p>}
                                </div>
                            </div>

                            <div className="form-group-row" style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "25px" }}>
                                <div className="form-group displayorder" style={{ width: "150px" }}>
                                    <label>Display Order</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData.DisplayOrder}
                                        onChange={(e) => handleInput("DisplayOrder", e.target.value)}
                                    />
                                </div>
                                <div className="form-group-row statusac" style={{ marginTop: "30px" }}>
                                    <input
                                        type="checkbox"
                                        id="chkActiveStatus"
                                        checked={formData.ActiveStatus}
                                        onChange={(e) => handleInput("ActiveStatus", e.target.checked)}
                                    />
                                    <label htmlFor="chkActiveStatus">Status (Active/Inactive)</label>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: "20px", display: "block" }}>
                                <label style={{ display: "block", marginBottom: "10px" }}>Job Description*</label>
                                <SunEditor
                                    lang="en"
                                    name="CareerDescription"
                                    width="100%"
                                    height="250px"
                                    setContents={formData.CareerDescription || ""}
                                    onChange={(content) => handleInput("CareerDescription", content)}
                                    setOptions={editorOptions}
                                />
                                {formErrors.CareerDescription && <p className="error">{formErrors.CareerDescription}</p>}
                            </div>


                        </div>
                    </div>
                </div>
                <div className="button-group" style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
                    <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader />} Submit
                    </button>
                    <Link href="/chanderpur-admin/manage-career" className="submit-btn">
                        Back
                    </Link>
                </div>
            </div>
        </main>
    );
}