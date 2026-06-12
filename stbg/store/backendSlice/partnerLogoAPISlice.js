import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const partnerLogoAPISlice = createApi({
  reducerPath: "partnerLogoAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/partnerLogo`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["PartnerLogo"],
  endpoints: (builder) => ({
    getPartnerLogos: builder.query({
      query: () => `/all-partnerLogos`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ PartnerLogoID }) => ({ type: "PartnerLogo", id: PartnerLogoID })),
            { type: "PartnerLogo", id: "LIST" },
          ]
          : [{ type: "PartnerLogo", id: "LIST" }],
    }),

    getPartnerLogoById: builder.query({
      query: (id) => `/fill-partnerLogo-data?PartnerLogoID=${id}`,
      providesTags: (result, error, id) => [{ type: "PartnerLogo", id }],
    }),

    saveOrUpdatePartnerLogo: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-partnerLogo`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "PartnerLogo", id: "LIST" }],
    }),

    deletePartnerLogo: builder.mutation({
      query: (PartnerLogoID) => ({
        url: `/delete-partnerLogo/${PartnerLogoID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, PartnerLogoID) => [
        { type: "PartnerLogo", id: PartnerLogoID },
        { type: "PartnerLogo", id: "LIST" },
      ],
    }),
    updatePartnerLogoStatus: builder.mutation({
      query: ({ PartnerLogoID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { PartnerLogoID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { PartnerLogoID }) => [
        { type: "PartnerLogo", id: PartnerLogoID },
      ],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "PartnerLogo", id: "MAX_ORDER" }],
    }),
    updateDisplayOrder: builder.mutation({
      query: (formData) => ({
        url: `/update-display-order`,
        method: "POST",
        body: formData,
        formData: true
      }),
      invalidatesTags: [{ type: "PartnerLogo", id: "LIST" }],
    }),
  }),
});

export const {
  useGetPartnerLogosQuery,
  useGetPartnerLogoByIdQuery,
  useSaveOrUpdatePartnerLogoMutation,
  useDeletePartnerLogoMutation,
  useUpdatePartnerLogoStatusMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery
} = partnerLogoAPISlice;