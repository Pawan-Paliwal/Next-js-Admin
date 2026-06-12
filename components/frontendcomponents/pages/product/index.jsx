"use client";
import Hero from "@/components/frontendcomponents/organisms/Hero";
import React from "react";
import ProductList from "./ProductList";
import Intro from "./Intro";
import { useGetActiveProductsQuery } from "@/store/backendSlice/productAPISlice";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

const Product = () => {
  const { data, isLoading } = useGetActiveProductsQuery();
    if (isLoading) return <Loading />;
  const router = useRouter();

  if (isLoading) return null;

  if (!data?.products?.length) {
    router.replace("/");
    return null;
  }

  return (
    <>
      <Hero
        video="/video/product-hero.mp4"
        title="Build for productivity. Designed for Performance "
        scrollTo="#product-list"
        className="[&_h1]:max-w-[700px]! [&_h1]:text-[48px]!"
      />
      <Intro />
      <ProductList productData={data.products} />
    </>
  );
};

export default Product;