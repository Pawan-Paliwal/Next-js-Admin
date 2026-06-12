"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSaveEnquiryMutation } from "@/store/backendSlice/contactUsAPISlice";
import { usePathname } from "next/navigation";
import { useModalStore } from "@/store/modalStore";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import { useGetFooterDataQuery } from "@/store/backendSlice/homeAPISlice";
import Button from "@/components/frontendcomponents/atoms/Button";

export default function ContactForm() {
    const openThankyouPop = useModalStore((state) => state.openThankyouPop);
    const pathname = usePathname();

    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const { data: footerData } = useGetFooterDataQuery();

    const [openProject, setOpenProject] = useState(false);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const dropdownRef = useRef(null);

    const footerProductsData = footerData?.footerProducts || [];

    const projectData = footerProductsData.map(group => ({
        value: group.name,
        label: group.displayName,
        url: group.displayUrl || `/${group.url}`
    }));

    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
        pincode: "",
        city: "",
        state: "",
    });

    const [saveEnquiry] = useSaveEnquiryMutation();

    useEffect(() => {
        const inputBoxes = document.querySelectorAll(".form-control");
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

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenProject(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
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
                if (name === "city" && value.trim()) {
                    delete newErrors.city;
                }
                if (name === "state" && value.trim()) {
                    delete newErrors.state;
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
        setTouched((prev) => ({ ...prev, [name]: true }));
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

        if (!formValues.city.trim()) {
            errors.city = "City is required.";
        }

        if (!formValues.state.trim()) {
            errors.state = "State is required.";
        }

        if (!formValues.pincode.trim()) {
            errors.pincode = "Pincode is required.";
        } else {
            const pincodeRegex = /^[0-9]{6}$/;
            if (!pincodeRegex.test(formValues.pincode.trim())) {
                errors.pincode = "Pincode must be 6 digits.";
            }
        }

        if (selectedProjects.length === 0) {
            errors.project = "Product selection is required.";
        }

        return errors;
    };

    const handleSubmit = async () => {
        setTouched({
            name: true,
            email: true,
            phone: true,
            city: true,
            state: true,
            pincode: true,
            project: true,
        });

        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        const selectedNames = selectedProjects
            .map((v) => projectData.find((p) => p.value === v)?.label)
            .filter(Boolean)
            .join(", ");

        const payload = {
            FullName: formValues.name,
            EmailID: formValues.email,
            PhoneNo: formValues.phone,
            City: formValues.city,
            State: formValues.state,
            Pincode: formValues.pincode,
            Product: selectedNames,
            EnquiryFor: selectedNames,
            PageName: pathname,
            EnquiryType: "Normal Enquiry",
            Message: "",
        };

        try {
            setSubmitIsLoading(true);
            const res = await saveEnquiry(payload).unwrap();
            if (res?.success) {
                openThankyouPop(
                    "Your enquiry has been received. Our team is reviewing your request and will respond as soon as possible."
                );
                setFormValues({
                    name: "",
                    email: "",
                    phone: "",
                    city: "",
                    state: "",
                    pincode: "",
                });
                setSelectedProjects([]);
                setTouched({});
                setFormErrors({});
            } else {
                toast.error(res?.message || "Failed to submit enquiry.");
            }
        } catch (err) {
            console.error(err);
            const msg =
                err?.data?.message ||
                err?.error ||
                "An error occurred while submitting enquiry.";
            toast.error(msg);
        } finally {
            setSubmitIsLoading(false);
        }
    };

    return (
        <section>
            <div className="contact_form sec-pad-all">
                <div className="container">
                    <div className="main_wrapper flex">
                        <div className="heading">
                            <h2>
                                Explore Potential <span>Partnerships</span>
                            </h2>
                            <p>
                                Looking to collaborate. Build together. Make an impact. Share
                                your details and discover how our products can create value for
                                your organization.
                            </p>
                        </div>

                        <div className="form">
                            <div className="form-grid">
                                <div
                                    className={`form-group border ${touched.name && formErrors.name ? "has-error" : ""
                                        }`}
                                >
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

                                <div
                                    className={`form-group border ${touched.email && formErrors.email ? "has-error" : ""
                                        }`}
                                >
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

                                <div
                                    className={`form-group border ${touched.phone && formErrors.phone ? "has-error" : ""
                                        }`}
                                >
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

                                <div
                                    className={`form-group border ${touched.city && formErrors.city ? "has-error" : ""
                                        }`}
                                >
                                    <label htmlFor="city">City*</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        className="form-control no-focus"
                                        placeholder="Gurugram"
                                        value={formValues.city}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.city && formErrors.city && (
                                        <div className="error">{formErrors.city}</div>
                                    )}
                                </div>

                                <div
                                    className={`form-group border ${touched.state && formErrors.state ? "has-error" : ""
                                        }`}
                                >
                                    <label htmlFor="state">State*</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        className="form-control no-focus"
                                        placeholder="State"
                                        value={formValues.state}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.state && formErrors.state && (
                                        <div className="error">{formErrors.state}</div>
                                    )}
                                </div>

                                <div
                                    className={`form-group border ${touched.pincode && formErrors.pincode ? "has-error" : ""
                                        }`}
                                >
                                    <label htmlFor="pincode">Pincode*</label>
                                    <input
                                        type="tel"
                                        id="pincode"
                                        name="pincode"
                                        className="form-control no-focus"
                                        placeholder="XXXXXX"
                                        maxLength="6"
                                        value={formValues.pincode}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.pincode && formErrors.pincode && (
                                        <div className="error">{formErrors.pincode}</div>
                                    )}
                                </div>
                                <div
                                    className={`projectCat form-group full ${touched.project && formErrors.project ? "has-error" : ""
                                        }`}
                                    ref={dropdownRef}
                                >
                                    <label htmlFor="pincode">Select Products*</label>
                                    <div
                                        className="input_wrap placeholder"
                                        onClick={() => setOpenProject((p) => !p)}
                                    >
                                        <input
                                            className="form-control no-focus"
                                            placeholder="Select Products*"
                                            readOnly
                                            value={
                                                selectedProjects.length
                                                    ? selectedProjects
                                                        .map((v) =>
                                                            projectData.find((p) => p.value === v)?.label
                                                        )
                                                        .filter(Boolean)
                                                        .join(", ")
                                                    : ""
                                            }
                                        />
                                    </div>
                                    <div
                                        className={`dropdown__wrap ${openProject ? "active" : ""}`}
                                    >
                                        <div className="dropdown_menu">
                                            {projectData.map((project) => (
                                                <div
                                                    className="options"
                                                    key={project.value}
                                                    onClick={() => {
                                                        setSelectedProjects((prev) => {
                                                            const isSelected = prev.includes(project.value);
                                                            const newSelection = isSelected
                                                                ? prev.filter((v) => v !== project.value)
                                                                : [...prev, project.value];
                                                            if (newSelection.length > 0) {
                                                                setFormErrors((prevErrors) => {
                                                                    const newErrors = { ...prevErrors };
                                                                    delete newErrors.project;
                                                                    return newErrors;
                                                                });
                                                            }

                                                            return newSelection;
                                                        });
                                                        setTouched((t) => ({ ...t, project: true }));
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProjects.includes(project.value)}
                                                        onChange={() => { }}
                                                    />
                                                    <div className="in-bx"></div>
                                                    <span>{project.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {touched.project && formErrors?.project && (
                                        <p className="error">{formErrors.project}</p>
                                    )}
                                </div>
                            </div>
                            <div className="disclaim">
                                <p>
                                    By clicking on submit button, you are agreeing the{" "}
                                    <Link href="/terms-of-use">terms and conditions</Link>
                                </p>
                            </div>

                            <Button
                                classname="white"
                                buttonText="Submit"
                                onClick={handleSubmit}
                                disabled={submitIsLoading}
                            >
                                {submitIsLoading ? (
                                    <span
                                        style={{ display: "flex", alignItems: "center", gap: "6px" }}
                                    >
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
    );
}