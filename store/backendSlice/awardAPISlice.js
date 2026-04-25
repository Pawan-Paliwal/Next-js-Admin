import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const awardAPISlice = createApi({
  reducerPath: "AwardLogoAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/award`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["AwardLogo"],
  endpoints: (builder) => ({
    getAwardLogos: builder.query({
      query: () => `/all-AwardLogos`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ AwardLogoID }) => ({ type: "AwardLogo", id: AwardLogoID })),
            { type: "AwardLogo", id: "LIST" },
          ]
          : [{ type: "AwardLogo", id: "LIST" }],
    }),

    getAwardLogoById: builder.query({
      query: (id) => `/fill-AwardLogo-data?AwardLogoID=${id}`,
      providesTags: (result, error, id) => [{ type: "AwardLogo", id }],
    }),

    saveOrUpdateAwardLogo: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-AwardLogo`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "AwardLogo", id: "LIST" }],
    }),

    deleteAwardLogo: builder.mutation({
      query: (AwardLogoID) => ({
        url: `/delete-AwardLogo/${AwardLogoID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, AwardLogoID) => [
        { type: "AwardLogo", id: AwardLogoID },
        { type: "AwardLogo", id: "LIST" },
      ],
    }),
    updateAwardLogoStatus: builder.mutation({
      query: ({ AwardLogoID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { AwardLogoID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { AwardLogoID }) => [
        { type: "AwardLogo", id: AwardLogoID },
      ],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "AwardLogo", id: "MAX_ORDER" }],
    }),
    updateDisplayOrder: builder.mutation({
      query: (formData) => ({
        url: `/update-display-order`,
        method: "POST",
        body: formData,
        formData: true
      }),
      invalidatesTags: [{ type: "AwardLogo", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAwardLogosQuery,
  useGetAwardLogoByIdQuery,
  useSaveOrUpdateAwardLogoMutation,
  useDeleteAwardLogoMutation,
  useUpdateAwardLogoStatusMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery
} = awardAPISlice;