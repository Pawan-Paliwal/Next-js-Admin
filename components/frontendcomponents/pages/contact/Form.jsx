"use client";

import Button from "@/components/frontendcomponents/atoms/Button";
import Heading from "@/components/frontendcomponents/atoms/Heading";
import Input from "@/components/frontendcomponents/atoms/Input";
import PhoneInput from "@/components/frontendcomponents/atoms/PhoneInput";
import Textarea from "@/components/frontendcomponents/atoms/Textarea";
import useEnquiry from "@/hooks/useEnquiry";
import React from "react";
import Loading from "@/app/loading";

const Form = () => {
  const { formData, errors, handleChange, handlePhoneChange, handleSubmit, isLoading } = useEnquiry("General Enquiry");

  return (
    <>
      {isLoading && <Loading />}
      <div className="px-[15px] py-10 md:px-6 md:py-12 lg:px-14 lg:py-14">
        <Heading className="mx-auto hidden max-w-[419px] text-center md:text-3xl xl:text-4xl! xl:leading-[42px]!">
          Let's Build Solutions Together
        </Heading>
        <form onSubmit={handleSubmit} className="mt:mt-12 mt-8 grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-10 lg:mt-14">
          <div>
            <Input label="Name*" name="FullName" value={formData.FullName} onChange={handleChange} />
            {errors.FullName && <p className="mt-1 text-xs text-red-500">{errors.FullName}</p>}
          </div>                                                                                                                                                  
          <div>
            <Input label="Email*" name="EmailID" type="email" value={formData.EmailID} onChange={handleChange} />
            {errors.EmailID && <p className="mt-1 text-xs text-red-500">{errors.EmailID}</p>}
          </div>
          <PhoneInput label="Phone*" value={formData.PhoneNo} onChange={handlePhoneChange} error={errors.PhoneNo} defaultCountryCode="IN" />
          <div>
            <Input className="h-full" label="Company Name" name="CompanyName" value={formData.CompanyName} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Textarea rows={3} label="Message" name="Message" value={formData.Message} onChange={handleChange} />
            {errors.Message && <p className="mt-1 text-xs text-red-500">{errors.Message}</p>}
          </div>
          <Button type="submit" className="mx-auto w-full md:col-span-2" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Form;



// "use client";

// import Button from "@/components/frontendcomponents/atoms/Button";
// import Heading from "@/components/frontendcomponents/atoms/Heading";
// import Input from "@/components/frontendcomponents/atoms/Input";
// import PhoneInput from "@/components/frontendcomponents/atoms/PhoneInput";
// import Textarea from "@/components/frontendcomponents/atoms/Textarea";
// import useEnquiry from "@/hooks/useEnquiry";
// import React from "react";

// const Form = () => {
//   const { formData, errors, handleChange, handlePhoneChange, handleSubmit, isLoading } = useEnquiry("General Enquiry");

//   return (
//     <div className="px-[15px] py-10 md:px-6 md:py-12 lg:px-14 lg:py-14">
//       <Heading className="mx-auto hidden max-w-[419px] text-center md:text-3xl xl:text-4xl! xl:leading-[42px]!">
//         Let's Build Solutions Together
//       </Heading>

//       <form onSubmit={handleSubmit} className="mt:mt-12 mt-8 grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-10 lg:mt-14">
//         <Input label="Name*" name="FullName" value={formData.FullName} onChange={handleChange} />
//         {errors.FullName && <p className="mt-1 text-xs text-red-500">{errors.FullName}</p>}

//         <Input label="Email*" name="EmailID" type="email" value={formData.EmailID} onChange={handleChange} />
//         {errors.EmailID && <p className="mt-1 text-xs text-red-500">{errors.EmailID}</p>}

//         <PhoneInput label="Phone*" value={formData.PhoneNo} onChange={handlePhoneChange} error={errors.PhoneNo} defaultCountryCode="IN" />

//         <Input className="h-full" label="Company Name" name="CompanyName" value={formData.CompanyName} onChange={handleChange} />
//         {errors.CompanyName && <p className="mt-1 text-xs text-red-500">{errors.CompanyName}</p>}

//         <Textarea rows={3} label="Message" name="Message" value={formData.Message} onChange={handleChange} className="md:col-span-2" />
//         {errors.Message && <p className="mt-1 text-xs text-red-500">{errors.Message}</p>}

//         <Button className="mx-auto w-full md:col-span-2" type="submit" disabled={isLoading}>
//           {isLoading ? "Submitting..." : "Submit"}
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default Form;