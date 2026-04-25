import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const collaborationAPISlice = createApi({
  reducerPath: "collaborationAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/collaboration`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["Collaboration"],
  endpoints: (builder) => ({
    getAllCollaborations: builder.query({
      query: () => `/all-collaborations`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ CollaborationID }) => ({ type: "Collaboration", id: CollaborationID })),
            { type: "Collaboration", id: "LIST" },
          ]
          : [{ type: "Collaboration", id: "LIST" }],
    }),
    getCollaborationById: builder.query({
      query: (id) => `/fill-collaboration-data?CollaborationID=${id}`,
      providesTags: (result, error, id) => [{ type: "Collaboration", id }],
    }),
    saveOrUpdateCollaboration: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-collaboration`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Collaboration", id: "LIST" }],
    }),
    deleteCollaboration: builder.mutation({
      query: (CollaborationID) => ({
        url: `/delete-collaboration/${CollaborationID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, CollaborationID) => [
        { type: "Collaboration", id: CollaborationID },
        { type: "Collaboration", id: "LIST" },
      ],
    }),
    updateDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Collaboration", id: "LIST" }],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Collaboration", id: "LIST" }],
    }),
    updateCollaborationStatus: builder.mutation({
      query: ({ CollaborationID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { CollaborationID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { CollaborationID }) => [
        { type: "Collaboration", id: CollaborationID },
      ],
    }),
  }),
});

export const {
  useGetAllCollaborationsQuery,
  useGetCollaborationByIdQuery,
  useSaveOrUpdateCollaborationMutation,
  useDeleteCollaborationMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery,
  useUpdateCollaborationStatusMutation,
} = collaborationAPISlice;
