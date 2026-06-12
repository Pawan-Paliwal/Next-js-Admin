"use client";

import Button from "@/components/frontendcomponents/atoms/Button";
import Input from "@/components/frontendcomponents/atoms/Input";
import PhoneInput from "@/components/frontendcomponents/atoms/PhoneInput";
import useEnquiry from "@/hooks/useEnquiry";
import React from "react";

const Article = ({ children, name }) => {
  const { formData, errors, handleChange, handlePhoneChange, handleSubmit, isLoading } = useEnquiry(name);

  return (
    <section className="py-10">
      <div className="px-14 2xl:px-22 grid grid-cols-[1fr_380px] gap-20 2xl:gap-30">
        <article className="prose min-w-full *:text-justify">
          {children}
        </article>

        <div className="sticky top-[calc(var(--header-height)+20px)] h-fit rounded-md bg-[linear-gradient(360deg,#FFFFFF_0%,#E9F5FA_65.87%,#D2EAF6_100%)] px-6 py-10 text-center shadow-[0_0_0_1px_#1B1F2326,0_1px_3px_0px_#00000005]">
          <h3 className="text-primary mb-2 text-2xl font-bold">
            Manufacturing Solutions
          </h3>
          <p className="text-center">Connect with our team to bring your production plans to life</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-6">
            <div className="w-full">
              <Input label="Name*" name="FullName" value={formData.FullName} onChange={handleChange} />
              {errors.FullName && <p className="mt-1 text-xs text-red-500 text-left">{errors.FullName}</p>}
            </div>

            <PhoneInput
              label="Phone*"
              value={formData.PhoneNo}
              onChange={handlePhoneChange}
              error={errors.PhoneNo}
              defaultCountryCode="IN"
              placeholder="98765 43210"
            />

            <div className="w-full">
              <Input label="Email*" name="EmailID" type="email" value={formData.EmailID} onChange={handleChange} />
              {errors.EmailID && <p className="mt-1 text-xs text-red-500 text-left">{errors.EmailID}</p>}
            </div>

            <div className="w-full">
              <Input label="Message*" name="Message" value={formData.Message} onChange={handleChange} />
              {errors.Message && <p className="mt-1 text-xs text-red-500 text-left">{errors.Message}</p>}
            </div>

            <Button type="submit" className="mt-3 w-fit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Enquire Now"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Article;