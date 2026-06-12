import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const careerEnquiryApi = createApi({
  reducerPath: "careerEnquiryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["CareerEnquiry"],
  endpoints: (builder) => ({
    fetchCareerEnquiries: builder.query({
      query: () => `/careerEnquiry/all-careerdata`,
      providesTags: ["CareerEnquiry"],
    }),

    deleteCareerEnquiry: builder.mutation({
      query: (CareerID) => ({
        url: `/careerEnquiry/delete-career/${CareerID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CareerEnquiry"],
    }),
    submitCareerEnquiry: builder.mutation({
      query: (formData) => ({
        url: `/careerEnquiry/save-career-enquiry`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["CareerEnquiry"],
    }),
  }),
});

export const {
  useFetchCareerEnquiriesQuery,
  useDeleteCareerEnquiryMutation,
  useSubmitCareerEnquiryMutation
} = careerEnquiryApi;
