import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const masterAPISlice = createApi({
  reducerPath: "masterAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/master`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Master", "Media", "Job"],
  endpoints: (builder) => ({
    getPartnerPageData: builder.query({
      query: () => "/all-partnerdata",
      providesTags: [{ type: "Master", id: "PARTNER_PAGE" }],
    }),
    getMediaPageData: builder.query({
      query: (params) => ({
        url: "/all-mediadata",
        params: params || {}, 
      }),
      providesTags: [{ type: "Media", id: "Media" }],
    }),
    getCareerPageData: builder.query({
      query: () => "/all-jobdata",
      providesTags: [{ type: "Job", id: "Job" }],
    }),
  }),
});


export const { useGetPartnerPageDataQuery, useGetMediaPageDataQuery, useGetCareerPageDataQuery } = masterAPISlice;
