import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const mediaAPISlice = createApi({
    reducerPath: "mediaAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/media`,
        credentials: "include",
        prepareHeaders: (headers) => {
            if (authHeader) {
                headers.set("Authorization", authHeader);
            }
            return headers;
        },
    }),
    tagTypes: ["Media"],
    endpoints: (builder) => ({
        getAllMedia: builder.query({
            query: () => `/all-media`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ MediaID }) => ({ type: "Media", id: MediaID })),
                        { type: "Media", id: "LIST" },
                    ]
                    : [{ type: "Media", id: "LIST" }],
        }),
        getAllMediaAdmin: builder.query({
            query: () => `/all-media-admin`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ MediaID }) => ({ type: "Media", id: MediaID })),
                        { type: "Media", id: "ADMIN_LIST" },
                    ]
                    : [{ type: "Media", id: "ADMIN_LIST" }],
        }),
        getMediaById: builder.query({
            query: (id) => `/fill-media-data?MediaID=${id}`,
            providesTags: (result, error, id) => [{ type: "Media", id }],
        }),
        saveOrUpdateMedia: builder.mutation({
            query: (formData) => ({
                url: `/save-or-update-media`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [
                { type: "Media", id: "LIST" },
                { type: "Media", id: "ADMIN_LIST" }
            ],
        }),
        deleteMedia: builder.mutation({
            query: (MediaID) => ({
                url: `/delete-media/${MediaID}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, MediaID) => [
                { type: "Media", id: MediaID },
                { type: "Media", id: "LIST" },
                { type: "Media", id: "ADMIN_LIST" }
            ],
        }),
        updateMediaStatus: builder.mutation({
            query: ({ MediaID, ActiveStatus }) => ({
                url: `/update-status`,
                method: "POST",
                body: { MediaID, ActiveStatus },
            }),
            invalidatesTags: (result, error, { MediaID }) => [
                { type: "Media", id: MediaID },
                { type: "Media", id: "LIST" },
                { type: "Media", id: "ADMIN_LIST" }
            ],
        }),
        updateDisplayOrder: builder.mutation({
            query: (formData) => ({
                url: `/update-display-order`,
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: [{ type: "Media", id: "LIST" }],
        }),
        getMaxDisplayOrder: builder.query({
            query: () => `/max-display-order`,
            providesTags: [{ type: "Media", id: "MAX_ORDER" }],
        }),
    }),
});

export const {
    useGetAllMediaQuery,
    useGetAllMediaAdminQuery,
    useGetMediaByIdQuery,
    useSaveOrUpdateMediaMutation,
    useDeleteMediaMutation,
    useUpdateMediaStatusMutation,
    useUpdateDisplayOrderMutation,
    useGetMaxDisplayOrderQuery
} = mediaAPISlice;