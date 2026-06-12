import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const caseStudyApiSlice = createApi({
  reducerPath: "caseStudyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/casestudies`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["CaseStudy"],
  endpoints: (builder) => ({
    getCaseStudies: builder.query({
      query: () => "/all-casestudies",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ CaseStudyId }) => ({
                type: "CaseStudy",
                id: CaseStudyId,
              })),
              { type: "CaseStudy", id: "LIST" },
            ]
          : [{ type: "CaseStudy", id: "LIST" }],
    }),
    getCaseStudyById: builder.query({
      query: (CaseStudyId) => `/fill-casestudy-data?CaseStudyId=${CaseStudyId}`,
      providesTags: (result, error, id) => [{ type: "CaseStudy", id }],
    }),
    getCaseStudiesByProductId: builder.query({
      query: (ProductId) => `/casestudies-by-product?ProductId=${ProductId}`,
      providesTags: [{ type: "CaseStudy", id: "LIST" }],
    }),
    getCaseStudiesBySubProductId: builder.query({
      query: (SubProductId) =>
        `/casestudies-by-subproduct?SubProductId=${SubProductId}`,
      providesTags: [{ type: "CaseStudy", id: "LIST" }],
    }),
    getCaseStudyBySlug: builder.query({
      query: (slug) => `/casestudy_data/${slug}`,
      providesTags: [{ type: "CaseStudy", id: "LIST" }],
    }),
    saveOrUpdateCaseStudy: builder.mutation({
      query: (formData) => ({
        url: "/save-or-update-casestudy",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "CaseStudy", id: "LIST" }],
    }),
    updateCaseStudyStatus: builder.mutation({
      query: ({ CaseStudyId, ActiveStatus }) => ({
        url: "/update-casestudy-status",
        method: "POST",
        body: { CaseStudyId, ActiveStatus },
      }),
      invalidatesTags: (result, error, { CaseStudyId }) => [
        { type: "CaseStudy", id: CaseStudyId },
        { type: "CaseStudy", id: "LIST" },
      ],
    }),
    deleteCaseStudy: builder.mutation({
      query: (CaseStudyId) => ({
        url: `/delete-casestudy/${CaseStudyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, CaseStudyId) => [
        { type: "CaseStudy", id: CaseStudyId },
        { type: "CaseStudy", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCaseStudiesQuery,
  useGetCaseStudyByIdQuery,
  useGetCaseStudiesByProductIdQuery,
  useGetCaseStudiesBySubProductIdQuery,
  useGetCaseStudyBySlugQuery,
  useSaveOrUpdateCaseStudyMutation,
  useUpdateCaseStudyStatusMutation,
  useDeleteCaseStudyMutation,
} = caseStudyApiSlice;
