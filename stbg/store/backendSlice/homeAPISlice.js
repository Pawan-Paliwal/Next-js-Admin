import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const homeAPISlice = createApi({
  reducerPath: "homeAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/home`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Home"],
  endpoints: (builder) => ({
    getHomeData: builder.query({
      query: () => `/all-homedata`,
      providesTags: [{ type: "Home", id: "LIST" }],
    }),
    getProductSectionData: builder.query({
      query: () => "/all-product",
      providesTags: [{ type: "Home", id: "LIST" }],
    }),
    getProductHeaderSectionData: builder.query({
      query: () => "/all-headerproduct",
      providesTags: [{ type: "Home", id: "LIST" }],
    }),
    getAboutUsPageData: builder.query({
      query: () => "/all-aboutusdata",
      providesTags: [{ type: "Home", id: "ABOUT_US" }],
    }),
    getFooterData: builder.query({
      query: () => "/footer-data",
      providesTags: [{ type: "Home", id: "FOOTER" }],
    }),

  }),
});

export const { useGetHomeDataQuery, useGetProductSectionDataQuery, useGetAboutUsPageDataQuery, useGetFooterDataQuery, useGetProductHeaderSectionDataQuery } =
  homeAPISlice;
