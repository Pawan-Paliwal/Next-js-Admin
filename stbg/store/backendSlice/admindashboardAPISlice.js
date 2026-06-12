import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const admindashboardAPISlice = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/dashboard`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: () => `/all_dashboardData_data`,
    }),
  }),
});

export const { useGetDashboardDataQuery } = admindashboardAPISlice;
