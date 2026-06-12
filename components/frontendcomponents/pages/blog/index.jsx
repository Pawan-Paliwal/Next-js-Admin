"use client";
import React from "react";
import RecentBlogs from "./RecentBlogs";
import BlogList from "./BlogList";
import { useGetAllActiveBlogsQuery } from "@/store/backendSlice/blogAPISlice";
import Loading from "@/app/loading";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Blog = () => {
  const { data: blogsData, isLoading, error } = useGetAllActiveBlogsQuery();
  if (isLoading) return <Loading />;
  const allBlogs = blogsData?.blogData?.map((item) => ({
    image: `/OnlineImages/BlogImages/${item.BlogImage}`,
    title: item.BlogName,
    date: item.PostedDate,
    slug: item.BlogNameURL,
    isRecent: item.RecentActiveStatus === 1,
  }));

  const recentBlogs = allBlogs?.filter((item) => item.isRecent);
  const blogList = allBlogs?.filter((item) => !item.isRecent);

  return (
    <>
      {recentBlogs?.length > 0 && <RecentBlogs recentBlogs={recentBlogs} />}
      {blogList?.length > 0 && <BlogList blogList={blogList} />}
    </>
  );
};

export default Blog;