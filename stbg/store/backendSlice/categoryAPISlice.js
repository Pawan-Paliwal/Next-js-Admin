import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const categoryAPISlice = createApi({
  reducerPath: "categoryAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/category`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategorys: builder.query({
      query: () => `/all-categorys`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ CategoryID }) => ({
              type: "Category",
              id: CategoryID,
            })),
            { type: "Category", id: "LIST" },
          ]
          : [{ type: "Category", id: "LIST" }],
    }),
    saveOrUpdateCategory: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-category`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    getCategoryById: builder.query({
      query: (id) => `/fill-Category-data?CategoryID=${id}`,
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    deleteCategory: builder.mutation({
      query: (CategoryID) => ({
        url: `/delete-category/${CategoryID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, CategoryID) => [
        { type: "Category", id: CategoryID },
        { type: "Category", id: "LIST" },
      ],
    }),
    updateDisplayOrder: builder.mutation({
      query: (formData) => ({
        url: `/update-display-order`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),
    updateCategoryStatus: builder.mutation({
      query: ({ CategoryID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { CategoryID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { CategoryID }) => [
        { type: "Category", id: CategoryID },
      ],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Category", id: "MAX_ORDER" }],
    }),
    getAllCategoryData: builder.query({
      query: () => `/all-categoryData`,
      providesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategorysQuery,
  useGetCategoryByIdQuery,
  useSaveOrUpdateCategoryMutation,
  useUpdateDisplayOrderMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryStatusMutation,
  useGetMaxDisplayOrderQuery,
  useGetAllCategoryDataQuery
} = categoryAPISlice;
