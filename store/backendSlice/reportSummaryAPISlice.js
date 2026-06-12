import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
// Need to check if running in browser to use btoa safely
const authHeader = typeof window !== 'undefined' ? "Basic " + window.btoa(`${username}:${password}`) : "";

export const reportSummaryAPISlice = createApi({
  reducerPath: "reportSummaryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    prepareHeaders: (headers) => {
      let header = authHeader;
      if (!header && typeof window === 'undefined') {
          header = "Basic " + Buffer.from(`${username}:${password}`).toString('base64');
      }
      if (header) {
        headers.set("Authorization", header);
      }
      return headers;
    },
  }),
  tagTypes: ["ReportSummary"],
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => "/ReportSummary/GetAdminDashboard",
      providesTags: ["ReportSummary"],
    }),
    getMonthWiseReport: builder.query({
      query: () => "/ReportSummary/GetMonthWiseReport",
      providesTags: ["ReportSummary"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetMonthWiseReportQuery,
} = reportSummaryAPISlice;
