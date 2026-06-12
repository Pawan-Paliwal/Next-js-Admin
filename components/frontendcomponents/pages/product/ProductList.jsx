import ListCard from "@/components/frontendcomponents/molecules/ListCard";
import React from "react";

const ProductList = ({ productData }) => {
  return (
    <section id="product-list" className="bg-background pt-14 pb-20">
      <div className="container">
        <div className="grid grid-cols-3 gap-5">
          {productData?.map((item, index) => (
            <ListCard
              key={index}
              title={item.ProductName}
              image={`/OnlineImages/ProductImages/${item.ProductMedia}`}
              descriptionTitle={item.ProductHeading}
              description={item.ProductListDescription}
              link={`/${item.ProductNameURL}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;