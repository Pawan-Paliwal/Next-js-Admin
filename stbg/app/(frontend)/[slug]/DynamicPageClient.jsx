"use client";

import Loading from "@/app/loading";
import { useGetProductPageDataQuery } from "@/store/backendSlice/productAPISlice";
import SwasthForFamiliesPage from "@/components/frontendcomponents/pages/swasth-families";
import SwasthForHospitalsPage from "@/components/frontendcomponents/pages/swasth-hospitals";
import SwasthForCorporatesPage from "@/components/frontendcomponents/pages/swasth-corporates";
import AmyaWellnessPage from "@/components/frontendcomponents/pages/amya-wellness";
import ProcalyxPharmaPage from "@/components/frontendcomponents/pages/procalyx-pharma";
import ProcalyxHospitalPage from "@/components/frontendcomponents/pages/procalyx-hospital";
import CaseStudyPage from "@/components/frontendcomponents/pages/case-study";

export default function DynamicPageClient({ slug, meta }) {
  const { data, isLoading, error } = useGetProductPageDataQuery(slug, {
    skip: !slug,
  });
  if (isLoading) return <Loading />;
  if (error || !data) {
    window.location.href = "/something-went-wrong";
    return null;
  }
  if (data.caseStudy) {
    return <CaseStudyPage SlugData={data} slug={slug} />;
  }
  const product = data.product;
  if (!product) {
    window.location.href = "/something-went-wrong";
    return null;
  }

  switch (product.ProductType) {
    case "swasth-for-families":
      return <SwasthForFamiliesPage SlugData={data} slug={slug} />;

    case "swasth-for-hospitals":
      return <SwasthForHospitalsPage SlugData={data} slug={slug} />;

    case "swasth-for-corporates":
      return <SwasthForCorporatesPage SlugData={data} slug={slug} />;

    case "swasthera":
      return <AmyaWellnessPage SlugData={data} slug={slug} />;

    case "procalyx-pharma":
      return <ProcalyxPharmaPage SlugData={data} slug={slug} />;

    case "procalyx-hospital":
      return <ProcalyxHospitalPage SlugData={data} slug={slug} />;

    default:
      return <SwasthForHospitalsPage SlugData={data} slug={slug} />;
  }
}
