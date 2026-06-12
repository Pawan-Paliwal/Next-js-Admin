"use client";
import React, { useState } from "react";
import Input from "../atoms/Input";
import Textarea from "../atoms/Textarea";

const EnquiryField = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Input
        name="name"
        value={formData.name}
        onChange={handleChange}
        label="Name"
      />
      <Input
        name="email"
        value={formData.email}
        onChange={handleChange}
        label="Email"
      />
      <Input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        label="Phone"
        type="number"
      />
      <Textarea
        name="message"
        rows={2}
        value={formData.message}
        onChange={handleChange}
        label="Message"
      />
    </>
  );
};

export default EnquiryField;
