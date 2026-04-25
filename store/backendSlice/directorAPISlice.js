import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const directorAPISlice = createApi({
  reducerPath: "directorAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/director`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["Director"],
  endpoints: (builder) => ({
    getAllDirectors: builder.query({
      query: () => `/all-directors`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ DirectorID }) => ({ type: "Director", id: DirectorID })),
            { type: "Director", id: "LIST" },
          ]
          : [{ type: "Director", id: "LIST" }],
    }),
    getDirectorById: builder.query({
      query: (id) => `/fill-director-data?DirectorID=${id}`,
      providesTags: (result, error, id) => [{ type: "Director", id }],
    }),
    saveOrUpdateDirector: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-director`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Director", id: "LIST" }],
    }),
    deleteDirector: builder.mutation({
      query: (DirectorID) => ({
        url: `/delete-director/${DirectorID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, DirectorID) => [
        { type: "Director", id: DirectorID },
        { type: "Director", id: "LIST" },
      ],
    }),
    updateDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Director", id: "LIST" }],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Director", id: "LIST" }],
    }),
    updateDirectorStatus: builder.mutation({
      query: ({ DirectorID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { DirectorID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { DirectorID }) => [
        { type: "Director", id: DirectorID },
      ],
    }),
  }),
});

export const {
  useGetAllDirectorsQuery,
  useGetDirectorByIdQuery,
  useSaveOrUpdateDirectorMutation,
  useDeleteDirectorMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery,
  useUpdateDirectorStatusMutation,
} = directorAPISlice;
