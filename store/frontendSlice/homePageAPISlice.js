import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function makeAuthHeader() {
  if (!username || !password) return "";
  const raw = `${username}:${password}`;
  if (typeof window === "undefined") {
    return "Basic " + Buffer.from(raw).toString("base64");
  } else {
    return "Basic " + btoa(raw);
  }
}

const authHeader = makeAuthHeader();
export const homePageAPISlice = createApi({
  reducerPath: "homePageAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/homepage`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: [
    "HomePage",
    "AboutPage",
    "ClientPage",
    "WhatsNewPage",
    "TestimonialPage",
    "GalleryPage",
    "VideoGalleryPage",
    "CareerPage",
    "HeaderPage",
    "FooterPage"
  ],
  endpoints: (builder) => ({
    getHomePageData: builder.query({
      query: () => `/home-data`,
      providesTags: ["HomePage"],
    }),
    getAboutPageData: builder.query({
      query: () => `/about-data`,
      providesTags: ["AboutPage"],
    }),
    getClientPageData: builder.query({
      query: () => `/client-data`,
      providesTags: ["ClientPage"],
    }),
    getWhatsNewPageData: builder.query({
      query: () => `/whatsnew-data`,
      providesTags: ["WhatsNewPage"],
    }),
    getTestimonialData: builder.query({
      query: () => `/testimonial-data`,
      providesTags: ["TestimonialPage"],
    }),
    getGalleryData: builder.query({
      query: () => `/gallery-data`,
      providesTags: ["GalleryPage"],
    }),
    getVideoGalleryData: builder.query({
      query: () => `/video-gallery-data`,
      providesTags: ["VideoGalleryPage"],
    }),
    getCareerData: builder.query({
      query: () => `/career-data`,
      providesTags: ["CareerPage"],
    }),
    getHeaderData: builder.query({
      query: () => `/header-data`,
      providesTags: ["HeaderPage"],
    }),
    getFooterData: builder.query({
      query: () => `/footer-data`,
      providesTags: ["FooterPage"],
    }),
    getSearchData: builder.mutation({
      query: (body) => ({
        url: "/search-data",
        method: "POST",
        body, 
      }),
    }),
  }),
});

export const {
  useGetHomePageDataQuery,
  useGetAboutPageDataQuery,
  useGetClientPageDataQuery,
  useGetWhatsNewPageDataQuery,
  useGetTestimonialDataQuery,
  useGetGalleryDataQuery,
  useGetVideoGalleryDataQuery,
  useGetCareerDataQuery,
  useGetHeaderDataQuery,
  useGetFooterDataQuery,
  useGetSearchDataMutation
} = homePageAPISlice;