import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const testimonialAPISlice = createApi({
  reducerPath: "testimonialAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/testimonial`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Testimonial"],
  endpoints: (builder) => ({
    getAllTestimonials: builder.query({
      query: () => `/all-testimonials`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ TestimonialID }) => ({ type: "Testimonial", id: TestimonialID })),
            { type: "Testimonial", id: "LIST" },
          ]
          : [{ type: "Testimonial", id: "LIST" }],
    }),

    getTestimonialById: builder.query({
      query: (id) => `/fill-testimonial-data?TestimonialID=${id}`,
      providesTags: (result, error, id) => [{ type: "Testimonial", id }],
    }),

    saveOrUpdateTestimonial: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-testimonial`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),

    deleteTestimonial: builder.mutation({
      query: (TestimonialID) => ({
        url: `/delete-testimonial/${TestimonialID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, TestimonialID) => [
        { type: "Testimonial", id: TestimonialID },
        { type: "Testimonial", id: "LIST" },
      ],
    }),

    updateDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Testimonial", id: "LIST" }],
    }),

    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Testimonial", id: "LIST" }],
    }),

    updateTestimonialStatus: builder.mutation({
      query: ({ TestimonialID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { TestimonialID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { TestimonialID }) => [
        { type: "Testimonial", id: TestimonialID },
      ],
    }),
  }),
});

export const {
  useGetAllTestimonialsQuery,
  useGetTestimonialByIdQuery,
  useSaveOrUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery,
  useUpdateTestimonialStatusMutation,
} = testimonialAPISlice;
