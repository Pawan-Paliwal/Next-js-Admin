"use client";
import React from "react";
import { useSelector } from "react-redux";
import Loading from "@/app/loading";
import { useGetProductBySlugPublicQuery } from "@/store/backendSlice/productAPISlice";
import { useGetCompanyBySlugQuery } from "@/store/backendSlice/companyAPISlice";
import { useGetFacilityBySlugQuery } from "@/store/backendSlice/facilityCategoryAPISlice";
import { useGetTurnkeyProjectBySlugQuery } from "@/store/backendSlice/clientTypeAPISlice";
import ProductDetail from "@/components/frontendcomponents/pages/product/detail";
import CompanyDetail from "@/components/frontendcomponents/pages/company/index";
import Machining from "@/components/frontendcomponents/pages/manufacturing/detail";
import TrunkeyDetail from "@/components/frontendcomponents/pages/trunkey-solution/detail";

export default function DynamicPageClient({ meta, slug }: any) {
  const { user } = useSelector((state: any) => state.auth || {});
  const VendorID = user?.VendorID;

  const productQuery = useGetProductBySlugPublicQuery(slug, {
    skip: meta?.type !== "product",
  });

  const companyQuery = useGetCompanyBySlugQuery(slug, {
    skip: meta?.type !== "company",
  });

  const facilityQuery = useGetFacilityBySlugQuery(slug, {
    skip: meta?.type !== "facility",
  });

  const turnkeyQuery = useGetTurnkeyProjectBySlugQuery(slug, {
    skip: meta?.type !== "clienttype",
  });

  if (
    (meta?.type === "product" && productQuery.isLoading) ||
    (meta?.type === "company" && companyQuery.isLoading) ||
    (meta?.type === "facility" && facilityQuery.isLoading) ||
    (meta?.type === "clienttype" && turnkeyQuery.isLoading)
  ) {
    return <Loading />;
  }

  if (
    (meta?.type === "product" && productQuery.error) ||
    (meta?.type === "company" && companyQuery.error) ||
    (meta?.type === "facility" && facilityQuery.error) ||
    (meta?.type === "clienttype" && turnkeyQuery.error)
  ) {
    if (typeof window !== "undefined") {
      window.location.href = "/something-went-wrong";
    }
    return null;
  }

  switch (meta?.type) {
    case "product":
      return (
        <ProductDetail
          productId={productQuery.data?.product?.ProductId}
          DynamicData={productQuery?.data}
        />
      );
    case "company":
      return (
        <CompanyDetail
          companyData={companyQuery.data?.company}
          MoreCompanies={companyQuery.data?.otherCompanies}
        />
      );
    case "facility":
      return (
        <Machining
          slug={slug}
          category={facilityQuery.data?.category}
          products={facilityQuery.data?.products}
        />
      );
    case "clienttype":
      return (
        <TrunkeyDetail
          turnkeyProject={turnkeyQuery.data?.turnkeyProject}
          partnerLogos={turnkeyQuery.data?.partnerLogos}
        />
      );
    default:
      return <p>Something went wrong</p>;
  }
}