import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const careerApi = createApi({
  reducerPath: "careerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiUrl,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Career"],
  endpoints: (builder) => ({
    fetchCareers: builder.query({
      query: () => `/career/all-career`,
      providesTags: ["Career"],
    }),

    fetchCareerById: builder.query({
      query: (JobCategoryID) => `/career/fill-career-data?JobCategoryID=${JobCategoryID}`,
      providesTags: ["Career"],
    }),

    deleteCareer: builder.mutation({
      query: (JobCategoryID) => ({
        url: `/career/delete-career/${JobCategoryID}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Career"],
    }),

    submitCareer: builder.mutation({
      query: (formData) => ({
        url: `/career/save-or-update-career`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Career"],
    }),

    updateDisplayOrder: builder.mutation({
      query: (formData) => ({
        url: `/career/update-display-order`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Career"],
    }),

    updateCareerStatus: builder.mutation({
      query: ({ JobCategoryID, ActiveStatus }) => ({
        url: `/career/update-status`,
        method: "POST",
        body: { JobCategoryID, ActiveStatus },
      }),
      invalidatesTags: ["Career"],
    }),

    getMaxDisplayOrder: builder.query({
      query: () => `/career/max-display-order`,
      providesTags: [{ type: "Career", id: "MAX_ORDER" }],
    }),

    fetchCareersData: builder.query({
      query: () => `/career/all-careerdata`,
      providesTags: ["Career"],
    }),

    fetchAdminCareers: builder.query({
      query: () => `/career/all-careeradmindata`,
      providesTags: ["Career"],
    }),
  }),
});

export const {
  useFetchCareersQuery,
  useFetchCareerByIdQuery,
  useDeleteCareerMutation,
  useSubmitCareerMutation,
  useUpdateDisplayOrderMutation,
  useUpdateCareerStatusMutation,
  useGetMaxDisplayOrderQuery,
  useFetchCareersDataQuery,
  useFetchAdminCareersQuery
} = careerApi;
