import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const clientTypeAPISlice = createApi({
  reducerPath: "clientTypeAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/clienttype`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["ClientType", "TurnkeyProject"],
  endpoints: (builder) => ({
    getAllClientTypes: builder.query({
      query: () => "/all",
      providesTags: ["ClientType"],
    }),
    getClientTypeById: builder.query({
      query: (id) => `/get-by-id?ClientTypeID=${id}`,
      providesTags: ["ClientType"],
    }),
    saveOrUpdateClientType: builder.mutation({
      query: (data) => ({
        url: "/save-or-update",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClientType"],
    }),
    updateClientTypeStatus: builder.mutation({
      query: (data) => ({
        url: "/update-status",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClientType"],
    }),
    updateClientTypeDisplayOrder: builder.mutation({
      query: (data) => ({
        url: "/update-display-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClientType"],
    }),
    deleteClientType: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ClientType"],
    }),
    getClientTypeMaxDisplayOrder: builder.query({
      query: () => "/max-display-order",
      providesTags: ["ClientType"],
    }),
    getTurnkeyProject: builder.query({
      query: () => "/active-category",
      providesTags: ["TurnkeyProject"],
    }),
    getTurnkeyProjectBySlug: builder.query({
      query: (slug) => `/turnkey/${slug}`,
      providesTags: (result, error, slug) => [{ type: "TurnkeyProject", id: slug }],
    }),
  }),
});

export const {
  useGetAllClientTypesQuery,
  useGetClientTypeByIdQuery,
  useSaveOrUpdateClientTypeMutation,
  useUpdateClientTypeStatusMutation,
  useUpdateClientTypeDisplayOrderMutation,
  useDeleteClientTypeMutation,
  useGetClientTypeMaxDisplayOrderQuery,
  useGetTurnkeyProjectQuery,
  useGetTurnkeyProjectBySlugQuery
} = clientTypeAPISlice;
