"use client";
import InsightCard from "@/components/frontendcomponents/molecules/InsightCard";
import React from "react";

const BlogList = ({ blogList }) => {
  return (
    <section className="bg-background py-14">
      <div className="container grid grid-cols-3 gap-6">
        {blogList?.map((item, index) => (
          <InsightCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};

export default BlogList;