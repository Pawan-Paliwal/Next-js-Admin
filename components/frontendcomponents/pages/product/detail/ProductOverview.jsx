import Image from "next/image";
import React from "react";

const ProductOverview = ({ overviewData }) => {
  return (
    <section id="overview" className="py-16 bg-white">
      <div className="container grid grid-cols-2 gap-20">
        <div className="[&_h3]:text-[24px] [&_h3]:mb-6 [&_p]:not-last:mb-4 [&_h3]:leading-7.5 [&_h3]:font-semibold">
          <h3>{overviewData?.Section1Title}</h3>
          <div dangerouslySetInnerHTML={{ __html: overviewData?.Section1Description }} />
        </div>

        <figure className="rounded-md overflow-hidden">
          <Image
            src={`/OnlineImages/ProductImages/${overviewData?.Section1MediaUrl}`}
            alt={overviewData?.Section1Title || "product"}
            width={1920}
            height={1080}
          />
        </figure>
      </div>
    </section>
  );
};

export default ProductOverview;