"use client"
import { useModalStore } from "@/store/modalStore";
import Link from "next/link"
import { useState, useEffect } from "react";
import { useSaveEnquiryMutation } from "@/store/backendSlice/contactUsAPISlice";
import { usePathname, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Button from "../atoms/Button";
import Loading from "@/app/loading";
import "@/uploads/styles/component/component.css"


export default function NetworkFormSec({ classname = "", heading = "", subHeading, formHeading = "", ref, buttonText = "", ProductName = "", EnquiryType = "Normal Enquiry" }) {
    const openThankyouPop = useModalStore((state) => state.openThankyouPop);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
        pincode: "",
    });

    const [saveEnquiry] = useSaveEnquiryMutation();

    useEffect(() => {
        const inputBoxes = document.querySelectorAll(".network-form .form-control");
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
        } else if (name === "pincode") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 6) {
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
                if (name === "pincode") {
                    if (value.trim()) {
                        const pincodeRegex = /^[0-9]{6}$/;
                        if (pincodeRegex.test(value.trim())) {
                            delete newErrors.pincode;
                        } else if (touched[name]) {
                            newErrors.pincode = "Pincode must be 6 digits.";
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

        if (!formValues.pincode.trim()) {
            errors.pincode = "Pincode is required.";
        } else {
            const pincodeRegex = /^[0-9]{6}$/;
            if (!pincodeRegex.test(formValues.pincode.trim())) {
                errors.pincode = "Pincode must be 6 digits.";
            }
        }

        return errors;
    };

    const handleSubmit = async () => {
        setTouched({
            name: true,
            email: true,
            phone: true,
            pincode: true
        });

        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        const pathSegments = pathname.split('/').filter(Boolean);
        const enquiryForRaw = pathSegments[pathSegments.length - 1] || 'Partners';
        const formattedSlug = enquiryForRaw
            .replace(/-/g, " ")
            .replace(/\b\w/g, char => char.toUpperCase());
        const enquiryFor = ProductName?.trim() || formattedSlug;

        const payload = {
            FullName: formValues.name,
            EmailID: formValues.email,
            PhoneNo: formValues.phone,
            City: "",
            State: "",
            Pincode: formValues.pincode,
            Product: "",
            Message: "",
            EnquiryType: EnquiryType,
            EnquiryFor: enquiryFor,
            PageName: pathname,
        };

        try {
            setSubmitIsLoading(true);
            const saveData = await saveEnquiry(payload).unwrap();

            if (saveData?.success) {
                openThankyouPop(
                    "Your enquiry has been received. Our team is reviewing your request and will respond as soon as possible."
                );
                setFormValues({
                    name: "",
                    email: "",
                    phone: "",
                    pincode: ""
                });
                setFormErrors({});
                setTouched({});
            } else {
                toast.error(saveData?.message || "Failed to submit enquiry.");
            }
        } catch (err) {
            console.error(err);
            const msg = err?.data?.message || err?.error || "An error occurred while submitting enquiry.";
            toast.error(msg);
        } finally {
            setSubmitIsLoading(false);
        }
    };




    return (
        <section>
            <div className={`network-form sec-pad-all ${classname}`} ref={ref}>
                <div className="container">
                    <div className="network_wrapper flex">
                        <div className="heading">
                            <h2>{heading}</h2>
                            <p>{subHeading}</p>
                        </div>
                        <div className="form">
                            <div className="heading">
                                <h3>{formHeading}</h3>
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
                                <div className={`form-group border ${touched.pincode && formErrors.pincode ? 'has-error' : ''}`}>
                                    <label htmlFor="pincode">Pincode*</label>
                                    <input
                                        type="tel"
                                        id="pincode"
                                        name="pincode"
                                        className="form-control no-focus"
                                        placeholder="XXXXXXXXXX"
                                        maxLength="6"
                                        value={formValues.pincode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.pincode && formErrors.pincode && (
                                        <div className="error">{formErrors.pincode}</div>
                                    )}
                                </div>
                            </div>
                            <div className="disclaim">
                                <p>By clicking on submit button, you are agreeing the <Link href="/terms-of-use">terms and conditions</Link></p>
                            </div>
                            <Button buttonText={buttonText || "Submit"} onClick={handleSubmit} disabled={submitIsLoading}>
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
        </section>
    )
}