"use client"
import { useState, useEffect } from "react";
import { useModalStore } from "@/store/modalStore";
import { useSubmitCareerEnquiryMutation } from "@/store/backendSlice/careerEnquiryApi";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import "@/uploads/styles/component/component.css"
import Button from "../atoms/Button";

export default function PositionsPop() {
    const isPositionsOpen = useModalStore((state) => state.isPositionsOpen)
    const closePositionsPop = useModalStore((state) => state.closePositionsPop)
    const openThankyouPop = useModalStore((state) => state.openThankyouPop)
    const selectedPosition = useModalStore((state) => state.selectedPosition)
    const pathname = usePathname();

    const [submitCareerEnquiry, { isLoading: submitIsLoading }] = useSubmitCareerEnquiryMutation();
    const [resumeFile, setResumeFile] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});

    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const fileInputs = document.querySelectorAll('input[type="file"].form-control');
        const handleChange = (event) => {
            const input = event.target;
            const fileName = input.value.replace(/C:\\fakepath\\/i, '');
            const sibling = input.parentElement.querySelector('.file-name');
            if (sibling) {
                sibling.style.setProperty('--filenameinitial', fileName ? `"${fileName}"` : 'var(--filename)');
            }
        };
        fileInputs.forEach(input => {
            input.addEventListener('change', handleChange);
        });
        return () => {
            fileInputs.forEach(input => {
                input.removeEventListener('change', handleChange);
            });
        };
    }, []);

    useEffect(() => {
        const inputBoxes = document.querySelectorAll(".positions-pop .form-control");
        const handleFocus = function () {
            this.closest(".form-group")?.classList.add("active");
            this.classList.add("valid");
        };
        const handleBlur = function () {
            if (!this.value.trim()) {
                this.closest(".form-group")?.classList.remove("active");
                this.classList.remove("valid");
            }
        };
        inputBoxes.forEach((inputBox) => {
            inputBox.addEventListener("focus", handleFocus);
            inputBox.addEventListener("blur", handleBlur);
        });
        return () => {
            inputBoxes.forEach((inputBox) => {
                inputBox.removeEventListener("focus", handleFocus);
                inputBox.removeEventListener("blur", handleBlur);
            });
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 14) {
                setFormValues((prev) => ({ ...prev, [name]: numericValue }));
            }
        } else {
            setFormValues((prev) => ({ ...prev, [name]: value }));
        }

        if (touched[name] || formErrors[name]) {
            setFormErrors((prevErrors) => {
                const newErrors = { ...prevErrors };

                if (name === "name" && value.trim()) {
                    delete newErrors.name;
                }
                if (name === "email") {
                    if (value.trim()) {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(value.trim())) {
                            delete newErrors.email;
                        } else if (touched[name]) {
                            newErrors.email = "Email is not valid.";
                        }
                    }
                }
                if (name === "phone") {
                    const numericValue = value.replace(/\D/g, "");
                    if (numericValue.trim()) {
                        if (numericValue.length >= 10 && numericValue.length <= 14) {
                            delete newErrors.phone;
                        } else if (touched[name]) {
                            newErrors.phone = "Phone must be between 10 to 14 digits.";
                        }
                    }
                }

                return newErrors;
            });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setResumeFile(null);
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.resumeFile;
                return newErrors;
            });
            return;
        }
        const validTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (!validTypes.includes(file.type)) {
            setFormErrors(prev => ({
                ...prev,
                resumeFile: "Please upload only PDF or Word files (.pdf, .doc, .docx)"
            }));
            e.target.value = "";
            setResumeFile(null);
            return;
        }
        setResumeFile(file);
        setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.resumeFile;
            return newErrors;
        });
    };

    const validate = () => {
        const errors = {};
        if (!formValues.name.trim()) {
            errors.name = "Name is required.";
        }
        if (!formValues.email.trim()) {
            errors.email = "Email is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formValues.email.trim())) {
                errors.email = "Email is not valid.";
            }
        }
        if (!formValues.phone.trim()) {
            errors.phone = "Phone is required.";
        } else {
            const phoneLength = formValues.phone.length;
            if (phoneLength < 10 || phoneLength > 14) {
                errors.phone = "Phone must be between 10 to 14 digits.";
            }
        }
        if (!resumeFile) {
            errors.resumeFile = "Resume is required.";
        }
        return errors;
    };

    const handleSubmit = async () => {
        setTouched({
            name: true,
            email: true,
            phone: true,
            resumeFile: true
        });
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        const formData = new FormData();
        formData.append("JobCategoryID", selectedPosition?.JobCategoryName || "");
        formData.append("FullName", formValues.name);
        formData.append("PhoneNo", formValues.phone);
        formData.append("EmailID", formValues.email);
        formData.append("Message", "");
        formData.append("Resume", resumeFile);
        try {
            const saveData = await submitCareerEnquiry(formData).unwrap();
            if (saveData?.success || saveData) {
                setFormValues({
                    name: "",
                    email: "",
                    phone: "",
                });
                setResumeFile(null);
                setFormErrors({});
                setTouched({});
                const fileInput = document.getElementById("careerResumePopup");
                if (fileInput) {
                    fileInput.value = "";
                }
                closePositionsPop();
                openThankyouPop("Your career inquiry has been submitted successfully. We will get back to you soon.");
            } else {
                toast.error(saveData?.message || "Failed to submit application.");
            }
        } catch (err) {
            console.error(err);
            const msg = err?.data?.message || err?.error || "An error occurred while submitting application.";
            toast.error(msg);
        }
    };

    return (
        <div className={`model positions-pop ${isPositionsOpen ? "is-open" : ""}`}>
            <button className="close" onClick={closePositionsPop}>
                <svg
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M0.75 0.75L23.25 23.25M0.75 23.25L23.25 0.75"
                        stroke="black"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <div className="model-body">
                <div className="post_wrapper">
                    <div className="post_details_wrap">
                        <div className="website-content post-content">
                            <h3>{selectedPosition?.JobCategoryName || "Position Title"}</h3>
                            <p>Job Location: {selectedPosition?.JobLocation || "Location"}</p>
                            {selectedPosition?.SmallDescription && (
                                <p>{selectedPosition.SmallDescription}</p>
                            )}
                            {selectedPosition?.JobCategoryDescription && (
                                <div dangerouslySetInnerHTML={{ __html: selectedPosition.JobCategoryDescription }} />
                            )}
                        </div>
                    </div>
                    <div className="post_form form">
                        <div className="heading">
                            <h2>Apply <span>Now</span></h2>
                        </div>
                        <div className="form-grid">
                            <div className={`form-group border ${touched.name && formErrors.name ? 'has-error' : ''}`}>
                                <label htmlFor="name">Name*</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control no-focus"
                                    placeholder="Your Name"
                                    value={formValues.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.name && formErrors.name && (
                                    <div className="error">{formErrors.name}</div>
                                )}
                            </div>
                            <div className={`form-group border ${touched.email && formErrors.email ? 'has-error' : ''}`}>
                                <label htmlFor="email">Email Address*</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control no-focus"
                                    placeholder="email@example.com"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.email && formErrors.email && (
                                    <div className="error">{formErrors.email}</div>
                                )}
                            </div>
                            <div className={`form-group border ${touched.phone && formErrors.phone ? 'has-error' : ''}`}>
                                <label htmlFor="phone">Phone*</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    className="form-control no-focus"
                                    placeholder="+91 99999 99999"
                                    maxLength="14"
                                    value={formValues.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {touched.phone && formErrors.phone && (
                                    <div className="error">{formErrors.phone}</div>
                                )}
                            </div>
                            <div className="form-group border">
                                <label htmlFor="applyFor">Apply For*</label>
                                <input
                                    type="text"
                                    id="applyFor"
                                    className="form-control no-focus"
                                    placeholder="Position"
                                    value={selectedPosition?.JobCategoryName || ""}
                                    readOnly
                                />
                            </div>
                            <div className={`form-group full file-input ${touched.resumeFile && formErrors.resumeFile ? 'has-error' : ''}`}>
                                <label htmlFor="careerResumePopup">Attach Resume*</label>
                                <input
                                    type="file"
                                    id="careerResumePopup"
                                    className="form-control no-focus"
                                    accept=".pdf, .doc, .docx"
                                    onChange={handleFileChange}
                                />
                                <div className="file-name"></div>
                                {touched.resumeFile && formErrors.resumeFile && (
                                    <div className="error">{formErrors.resumeFile}</div>
                                )}
                            </div>
                        </div>
                        <Button
                            buttonText={submitIsLoading ? "Submitting..." : "Submit"}
                            classname="top-right"
                            onClick={handleSubmit}
                            disabled={submitIsLoading}
                        >
                            {submitIsLoading ? (
                                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    Submit <Loading />
                                </span>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}