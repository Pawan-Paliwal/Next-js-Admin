"use client";

import { useState } from "react";
import { useSaveEnquiryMutation } from "@/store/backendSlice/contactUsAPISlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const useEnquiry = (enquiryType = "General Enquiry") => {
  const initialState = {
    FullName: "",
    EmailID: "",
    PhoneNo: "",
    CompanyName: "",
    Message: "",
    EnquiryType: enquiryType,
    EnquiryFor: "Contact Page",
    CountryName: null,
    PageName: typeof window !== "undefined" ? window.location.pathname : "",
  };

  const router = useRouter();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [saveEnquiry, { isLoading }] = useSaveEnquiryMutation();

  const validate = () => {
    const newErrors = {};
    if (!formData.FullName.trim())
      newErrors.FullName = "Please enter your name.";
    else if (formData.FullName.trim().length < 3)
      newErrors.FullName = "Name must be at least 3 characters.";
    if (!formData.EmailID.trim())
      newErrors.EmailID = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.EmailID))
      newErrors.EmailID = "Please provide a valid email format.";
    if (!formData.PhoneNo.trim())
      newErrors.PhoneNo = "Please provide your phone number.";
    // if (!formData.CompanyName.trim())
    //   newErrors.CompanyName = "Please enter your company name.";
    if (!formData.Message.trim())
      newErrors.Message = "Please enter your message.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[name];
        return newErr;
      });
    }
  };

  const handlePhoneChange = (fullNumber, nationalNumber, country) => {
    setFormData((prev) => ({
      ...prev,
      PhoneNo: fullNumber,
      CountryName: country?.name || null,
    }));
    if (errors.PhoneNo) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.PhoneNo;
        return newErr;
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors in the form.");
      return;
    }
    try {
      const response = await saveEnquiry(formData).unwrap();
      if (response.success) {
        toast.success(response.message || "Enquiry submitted successfully!");
        setFormData(initialState);
        setErrors({});
        router.push("/thank-you");
      }
    } catch (err) {
      console.error("Enquiry submission error:", err);
      toast.error(
        err?.data?.message ||
          "Failed to submit your enquiry. Please try again.",
      );
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handlePhoneChange,
    handleSubmit,
    isLoading,
    setFormData,
  };
};

export default useEnquiry;
