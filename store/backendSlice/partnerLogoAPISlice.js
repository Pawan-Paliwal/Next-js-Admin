import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const partnerLogoAPI = createApi({
  reducerPath: "partnerLogoAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/partnerlogo/`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["PartnerLogo"],
  endpoints: (builder) => ({
    getAllPartnerLogos: builder.query({
      query: () => "all-logos",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ PartnerLogoID }) => ({ type: "PartnerLogo", id: PartnerLogoID })),
              { type: "PartnerLogo", id: "LIST" },
            ]
          : [{ type: "PartnerLogo", id: "LIST" }],
    }),
    getPartnerLogoById: builder.query({
      query: (ID) => `fill-logo-data?PartnerLogoID=${ID}`,
      providesTags: (result, error, id) => [{ type: "PartnerLogo", id }],
    }),
    saveOrUpdatePartnerLogo: builder.mutation({
      query: (data) => ({
        url: "save-or-update-logo",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PartnerLogo", id: "LIST" }],
    }),
    deletePartnerLogo: builder.mutation({
      query: (ID) => ({
        url: `delete-logo/${ID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "PartnerLogo", id },
        { type: "PartnerLogo", id: "LIST" },
      ],
    }),
    updatePartnerLogoStatus: builder.mutation({
      query: (data) => ({
        url: "update-status",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { PartnerLogoID }) => [
        { type: "PartnerLogo", id: PartnerLogoID },
      ],
    }),
    updateDisplayOrder: builder.mutation({
      query: (data) => ({
        url: "update-display-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "PartnerLogo", id: "LIST" }],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => "max-display-order",
      providesTags: [{ type: "PartnerLogo", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllPartnerLogosQuery,
  useGetPartnerLogoByIdQuery,
  useSaveOrUpdatePartnerLogoMutation,
  useDeletePartnerLogoMutation,
  useUpdatePartnerLogoStatusMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery,
} = partnerLogoAPI;
