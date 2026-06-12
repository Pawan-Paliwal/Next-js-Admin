import BottomNav from "@/components/frontendcomponents/molecules/BottomNav";
import React from "react";
import ProductOverview from "./ProductOverview";
import ProductHighlights from "./ProductHighlights";
import Installation from "./Installation";
import SelectionGuide from "./SelectionGuide";
import ChooseDrive from "./ChooseDrive";
import ProductTech from "./ProductTech";
import ProductHero from "./ProductHero";

const ProductDetail = ({ productId, DynamicData }) => {
  const { product, gallery, highlights, technology, circuits, drives } = DynamicData || {};

  const heroData = {
    ProductName: product?.ProductName,
    ProductSmallDescription: product?.ProductSmallDescription,
    ProductMedia: product?.ProductMedia,
  };
  const overviewData = {
    Section1Title: product?.Section1Title,
    Section1Description: product?.Section1Description,
    Section1MediaUrl: product?.Section1MediaUrl,
  };
  const installationData = {
    Section3Title: product?.Section3Title,
    Section3Description: product?.Section3Description,
    Section3MediaUrl: product?.Section3MediaUrl,
  };
  const selectionData = {
    Section4Title: product?.Section4Title,
    Section4Description: product?.Section4Description,
    Section4MediaUrl: product?.Section4MediaUrl,
  };
  const productTechData = {
    Section5Title: product?.Section5Title,
    Section5Description: product?.Section5Description,
  };
  const driveData = {
    Section6Title: product?.Section6Title,
    Section6Description: product?.Section6Description,
  };
  
  const tabs = [
    (overviewData.Section1Title && overviewData.Section1Description) && { label: "Overview", path: `/${product?.ProductNameURL}/#overview` },
    highlights?.length > 0 && { label: "Highlight", path: `/${product?.ProductNameURL}/#highlight` },
    (productTechData.Section5Title && technology?.length > 0) && { label: "Technology", path: `/${product?.ProductNameURL}/#technology` },
    (selectionData.Section4Title && circuits?.length > 0) && { label: "Ball Mill Circuits", path: `/${product?.ProductNameURL}/#ball-mill-circuits` },
    (driveData.Section6Title && drives?.length > 0) && { label: "Choose your Drive", path: `/${product?.ProductNameURL}/#choose-your-drive` },
  ].filter(Boolean);


  return (
    <>
      <ProductHero heroData={heroData} gallery={gallery} />
      <div className="bg-primary h-full pb-10">
        {(overviewData.Section1Title && overviewData.Section1Description) && (
          <ProductOverview overviewData={overviewData} />
        )}
        {highlights?.length > 0 && (
          <ProductHighlights highlight={highlights} />
        )}
        {(installationData.Section3Title && installationData.Section3Description) && (
          <Installation installation={installationData} />
        )}
        {(selectionData.Section4Title && circuits?.length > 0) && (
          <SelectionGuide selection={selectionData} circuits={circuits} />
        )}
        {(productTechData.Section5Title && technology?.length > 0) && (
          <ProductTech productTechData={productTechData} technology={technology} />
        )}
        {(driveData.Section6Title && drives?.length > 0) && (
          <ChooseDrive DriveData={driveData} drives={drives} />
        )}
        <BottomNav data={tabs} />
      </div>
    </>
  );
};

export default ProductDetail;