// store/backendSlice/dashboardAPISlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardAPISlice = createApi({
  reducerPath: "dashboardAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
    }),
    getRevenueChart: builder.query({
      query: () => "/dashboard/revenue",
    }),
    getRecentEnquiries: builder.query({
      query: () => "/dashboard/recent-enquiries",
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRevenueChartQuery,
  useGetRecentEnquiriesQuery,
} = dashboardAPISlice;