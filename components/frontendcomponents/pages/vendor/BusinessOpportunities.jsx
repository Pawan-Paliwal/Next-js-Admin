import Image from "next/image";

const BusinessOpportunities = () => {
  return (
    <section id=" detail" className="py-16">
      <div className="container grid grid-cols-[493px_1fr] gap-20">
        <figure className="max-h-[517px] rounded-md">
          <Image
            src="/image/vendor/banner.png"
            alt="opportunity"
            width={1080}
            height={1920}
          />
        </figure>

        <div>
          <h2 className="leading-1.2 max-w-[526px] text-4xl font-bold">
            Business Opportunities for Vendors
          </h2>

          <div className="mt-6 flex flex-col gap-4 [&_ul]:pl-8 [&_ul>li]:relative [&_ul>li]:not-last:mb-2 [&_ul>li]:before:absolute [&_ul>li]:before:top-[4px] [&_ul>li]:before:left-[-28px] [&_ul>li]:before:h-[14px] [&_ul>li]:before:w-[14px] [&_ul>li]:before:bg-[url(/icon/check.svg)] [&_ul>li]:before:content-['']">
            <p>
              CPW has achieved a high level of sophistication and has emerged as
              one of the leaders in turnkey project execution. The company
              offers complete turnkey services from design, fabrication, supply,
              construction, installation, servicing, testing and commissioning
              of large scale projects. This brings to its projects a dependable
              supply source for the wide range of industrial products. As an
              Engineering company, we maintain a vast base of vendors, who
              supply components, parts, intermediate parts, raw materials etc.
            </p>
            <ul>
              <li>Bearings</li>
              <li>Liners for Ball Mills</li>
              <li>Alloy & Non-Alloy Steel </li>
              <li>Couplings</li>
              <li>Motors</li>
            </ul>
            <p>
              We are expanding our business horizons and are looking for
              established suppliers & vendors across the market for source our
              products on an exclusive basis. Suppliers of any of the above
              mentioned items may contact our Purchase Department for supplying
              the material through email / phone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessOpportunities;
