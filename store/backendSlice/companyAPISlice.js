import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const companyAPISlice = createApi({
  reducerPath: "companyAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/company`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    getAllCompanies: builder.query({
      query: () => `/all-companies`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ CompanyID }) => ({ type: "Company", id: CompanyID })),
            { type: "Company", id: "LIST" },
          ]
          : [{ type: "Company", id: "LIST" }],
    }),
    getCompanyById: builder.query({
      query: (id) => `/fill-company-data?CompanyID=${id}`,
      providesTags: (result, error, id) => [{ type: "Company", id }],
    }),
    saveOrUpdateCompany: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-company`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Company", id: "LIST" }],
    }),
    deleteCompany: builder.mutation({
      query: (CompanyID) => ({
        url: `/delete-company/${CompanyID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, CompanyID) => [
        { type: "Company", id: CompanyID },
        { type: "Company", id: "LIST" },
      ],
    }),
    updateDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Company", id: "LIST" }],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Company", id: "LIST" }],
    }),
    updateCompanyStatus: builder.mutation({
      query: ({ CompanyID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { CompanyID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { CompanyID }) => [
        { type: "Company", id: CompanyID },
      ],
    }),
    getCompanyBySlug: builder.query({
      query: (slug) => `/company/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Company", id: slug }],
    }),
  }),
});

export const {
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useSaveOrUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery,
  useUpdateCompanyStatusMutation,
  useGetCompanyBySlugQuery,
} = companyAPISlice;
