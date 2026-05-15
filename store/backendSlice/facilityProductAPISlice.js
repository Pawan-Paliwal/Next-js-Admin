import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const facilityProductAPISlice = createApi({
  reducerPath: "facilityProductAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/facilityproduct`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["FacilityProduct"],
  endpoints: (builder) => ({
    getAllFacilityProducts: builder.query({
      query: () => `/all-products`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ ProductID }) => ({ type: "FacilityProduct", id: ProductID })),
            { type: "FacilityProduct", id: "LIST" },
          ]
          : [{ type: "FacilityProduct", id: "LIST" }],
    }),
    getFacilityProductById: builder.query({
      query: (id) => `/fill-product-data?ProductID=${id}`,
      providesTags: (result, error, id) => [{ type: "FacilityProduct", id }],
    }),
    saveOrUpdateFacilityProduct: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-product`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "FacilityProduct", id: "LIST" }],
    }),
    deleteFacilityProduct: builder.mutation({
      query: (ProductID) => ({
        url: `/delete-product/${ProductID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, ProductID) => [
        { type: "FacilityProduct", id: ProductID },
        { type: "FacilityProduct", id: "LIST" },
      ],
    }),
    updateFacilityProductDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "FacilityProduct", id: "LIST" }],
    }),
    getFacilityProductMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "FacilityProduct", id: "LIST" }],
    }),
    updateFacilityProductStatus: builder.mutation({
      query: ({ ProductID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { ProductID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { ProductID }) => [
        { type: "FacilityProduct", id: ProductID },
      ],
    }),
  }),
});

export const {
  useGetAllFacilityProductsQuery,
  useGetFacilityProductByIdQuery,
  useSaveOrUpdateFacilityProductMutation,
  useDeleteFacilityProductMutation,
  useUpdateFacilityProductDisplayOrderMutation,
  useGetFacilityProductMaxDisplayOrderQuery,
  useUpdateFacilityProductStatusMutation,
} = facilityProductAPISlice;
