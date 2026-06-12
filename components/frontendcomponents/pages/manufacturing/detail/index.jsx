import Detail from "@/components/frontendcomponents/organisms/Detail";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import Facilities from "./Facilities";

const Machining = ({ slug, category, products = [] }) => {
  return (
    <>
      <Hero
        image={`/OnlineImages/FacilitycategoryImages/${category?.BannerImage}`}
        title={category?.CategoryName}
        description={category?.Tagline}
        scrollTo={`/${category?.CategoryNameURL}#detail`}
      />
      <Detail
        id="detail"
        data={
          <div dangerouslySetInnerHTML={{ __html: category?.Description }} />
        }
      />
      {products.length > 0 && <Facilities products={products} />}
    </>
  );
};

export default Machining;