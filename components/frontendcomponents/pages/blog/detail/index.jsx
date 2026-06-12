import React from "react";
import BlogHero from "./BlogHero";
import LatestInsight from "../../home/LatestInsight";
import Article from "../../../organisms/Article";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const BlogDetail = ({ blogId, initialData }) => {
  const bannerImage = initialData?.BlogBannerImage
    ? `/OnlineImages/BlogImages/${initialData.BlogBannerImage}`
    : null;


  return (
    <>
      <BlogHero
        title={initialData?.BlogName}
        date={initialData?.PostedDate}
        image={bannerImage}
      />
      <Article name={initialData?.BlogName}>
        <div dangerouslySetInnerHTML={{ __html: initialData?.Description }} />
      </Article>
      <LatestInsight title="More Insights" blogData={initialData?.moreBlogs} />
    </>
  );
};

export default BlogDetail;