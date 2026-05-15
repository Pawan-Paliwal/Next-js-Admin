import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const whatsNewAPISlice = createApi({
  reducerPath: "whatsNewAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/whatsnew`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["WhatsNew"],
  endpoints: (builder) => ({
    getAllWhatsNew: builder.query({
      query: () => `/all-whatsnew`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ WhatsNewID }) => ({ type: "WhatsNew", id: WhatsNewID })),
            { type: "WhatsNew", id: "LIST" },
          ]
          : [{ type: "WhatsNew", id: "LIST" }],
    }),
    getWhatsNewById: builder.query({
      query: (id) => `/fill-whatsnew-data?WhatsNewID=${id}`,
      providesTags: (result, error, id) => [{ type: "WhatsNew", id }],
    }),
    saveOrUpdateWhatsNew: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-whatsnew`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "WhatsNew", id: "LIST" }],
    }),
    deleteWhatsNew: builder.mutation({
      query: (WhatsNewID) => ({
        url: `/delete-whatsnew/${WhatsNewID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, WhatsNewID) => [
        { type: "WhatsNew", id: WhatsNewID },
        { type: "WhatsNew", id: "LIST" },
      ],
    }),
    updateWhatsNewDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "WhatsNew", id: "LIST" }],
    }),
    getWhatsNewMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "WhatsNew", id: "LIST" }],
    }),
    updateWhatsNewStatus: builder.mutation({
      query: ({ WhatsNewID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { WhatsNewID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { WhatsNewID }) => [
        { type: "WhatsNew", id: WhatsNewID },
      ],
    }),
  }),
});

export const {
  useGetAllWhatsNewQuery,
  useGetWhatsNewByIdQuery,
  useSaveOrUpdateWhatsNewMutation,
  useDeleteWhatsNewMutation,
  useUpdateWhatsNewDisplayOrderMutation,
  useGetWhatsNewMaxDisplayOrderQuery,
  useUpdateWhatsNewStatusMutation,
} = whatsNewAPISlice;
