import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const facilityCategoryAPISlice = createApi({
  reducerPath: "facilityCategoryAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/facilitycategory`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["FacilityCategory"],
  endpoints: (builder) => ({
    getAllFacilityCategories: builder.query({
      query: () => `/all-categories`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ CategoryID }) => ({ type: "FacilityCategory", id: CategoryID })),
            { type: "FacilityCategory", id: "LIST" },
          ]
          : [{ type: "FacilityCategory", id: "LIST" }],
    }),
    getFacilityCategoryById: builder.query({
      query: (id) => `/fill-category-data?CategoryID=${id}`,
      providesTags: (result, error, id) => [{ type: "FacilityCategory", id }],
    }),
    saveOrUpdateFacilityCategory: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-category`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "FacilityCategory", id: "LIST" }],
    }),
    deleteFacilityCategory: builder.mutation({
      query: (CategoryID) => ({
        url: `/delete-category/${CategoryID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, CategoryID) => [
        { type: "FacilityCategory", id: CategoryID },
        { type: "FacilityCategory", id: "LIST" },
      ],
    }),
    updateFacilityCategoryDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "FacilityCategory", id: "LIST" }],
    }),
    getFacilityCategoryMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "FacilityCategory", id: "LIST" }],
    }),
    updateFacilityCategoryStatus: builder.mutation({
      query: ({ CategoryID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { CategoryID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { CategoryID }) => [
        { type: "FacilityCategory", id: CategoryID },
      ],
    }),
    getActiveFacilityCategory: builder.query({
      query: () => `/activefacility`,
      providesTags: [{ type: "FacilityCategory", id: "LIST" }],
    }),
    getFacilityBySlug: builder.query({
      query: (slug) => `/facility/${slug}`,
      providesTags: (result, error, slug) => [{ type: "FacilityCategory", id: slug }],
    }),
  }),
});

export const {
  useGetAllFacilityCategoriesQuery,
  useGetFacilityCategoryByIdQuery,
  useSaveOrUpdateFacilityCategoryMutation,
  useDeleteFacilityCategoryMutation,
  useUpdateFacilityCategoryDisplayOrderMutation,
  useGetFacilityCategoryMaxDisplayOrderQuery,
  useUpdateFacilityCategoryStatusMutation,
  useGetActiveFacilityCategoryQuery,
  useGetFacilityBySlugQuery,
} = facilityCategoryAPISlice;
