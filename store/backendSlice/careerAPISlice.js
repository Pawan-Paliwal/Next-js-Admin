import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const careerAPISlice = createApi({
  reducerPath: "careerAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/career`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["Career"],
  endpoints: (builder) => ({
    getAllCareers: builder.query({
      query: () => `/all-career`,
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ CareerID }) => ({ type: "Career", id: CareerID })),
            { type: "Career", id: "LIST" },
          ]
          : [{ type: "Career", id: "LIST" }],
    }),
    getCareerById: builder.query({
      query: (id) => `/get-career-by-id?CareerID=${id}`,
      providesTags: (result, error, id) => [{ type: "Career", id }],
    }),
    saveOrUpdateCareer: builder.mutation({
      query: (data) => ({
        url: `/save-or-update-career`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Career", id: "LIST" }],
    }),
    deleteCareer: builder.mutation({
      query: (CareerID) => ({
        url: `/delete-career/${CareerID}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Career", id: "LIST" }],
    }),
    updateCareerStatus: builder.mutation({
      query: (data) => ({
        url: `/update-status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { CareerID }) => [
        { type: "Career", id: CareerID },
        { type: "Career", id: "LIST" },
      ],
    }),
    updateDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Career", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllCareersQuery,
  useGetCareerByIdQuery,
  useSaveOrUpdateCareerMutation,
  useDeleteCareerMutation,
  useUpdateCareerStatusMutation,
  useUpdateDisplayOrderMutation,
} = careerAPISlice;
