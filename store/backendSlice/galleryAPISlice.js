import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const galleryAPISlice = createApi({
  reducerPath: "galleryAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/gallery`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) headers.set("Authorization", authHeader);
      return headers;
    },
  }),
  tagTypes: ["Gallery", "GalleryPhoto"],
  endpoints: (builder) => ({
    getAllGallery: builder.query({
      query: () => `/all-gallery`,
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ galleryID }) => ({ type: "Gallery", id: galleryID })),
            { type: "Gallery", id: "LIST" },
          ]
          : [{ type: "Gallery", id: "LIST" }],
    }),
    getGalleryById: builder.query({
      query: (id) => `/get-gallery-by-id?galleryID=${id}`,
      providesTags: (result, error, id) => [{ type: "Gallery", id }],
    }),
    saveOrUpdateGallery: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-gallery`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Gallery", id: "LIST" }],
    }),
    deleteGallery: builder.mutation({
      query: (galleryID) => ({
        url: `/delete-gallery/${galleryID}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Gallery", id: "LIST" }],
    }),
    updateGalleryStatus: builder.mutation({
      query: (data) => ({
        url: `/update-status`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { galleryID }) => [
        { type: "Gallery", id: galleryID },
        { type: "Gallery", id: "LIST" },
      ],
    }),

    // Photos
    getPhotosByGalleryId: builder.query({
      query: (id) => `/get-photos-by-gallery-id?galleryID=${id}`,
      providesTags: (result) =>
        result?.data
          ? [
            ...result.data.map(({ photoID }) => ({ type: "GalleryPhoto", id: photoID })),
            { type: "GalleryPhoto", id: "LIST" },
          ]
          : [{ type: "GalleryPhoto", id: "LIST" }],
    }),
    saveGalleryPhotos: builder.mutation({
      query: (formData) => ({
        url: `/save-gallery-photos`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "GalleryPhoto", id: "LIST" }],
    }),
    deleteGalleryPhoto: builder.mutation({
      query: (photoID) => ({
        url: `/delete-gallery-photo/${photoID}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "GalleryPhoto", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllGalleryQuery,
  useGetGalleryByIdQuery,
  useSaveOrUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useUpdateGalleryStatusMutation,
  useGetPhotosByGalleryIdQuery,
  useSaveGalleryPhotosMutation,
  useDeleteGalleryPhotoMutation,
} = galleryAPISlice;
