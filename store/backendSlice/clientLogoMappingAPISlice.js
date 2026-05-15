import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const clientLogoMappingAPISlice = createApi({
  reducerPath: "clientLogoMappingAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/clientlogomapping`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["ClientLogoMapping"],
  endpoints: (builder) => ({
    getLogosByType: builder.query({
      query: (id) => `/logos-by-type?ClientTypeID=${id}`,
      providesTags: ["ClientLogoMapping"],
    }),
    assignLogos: builder.mutation({
      query: (data) => ({
        url: "/assign",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ClientLogoMapping"],
    }),
  }),
});

export const {
  useGetLogosByTypeQuery,
  useAssignLogosMutation,
} = clientLogoMappingAPISlice;
