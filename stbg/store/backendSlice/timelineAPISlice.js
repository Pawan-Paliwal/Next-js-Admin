import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const timelineAPISlice = createApi({
    reducerPath: "timelineAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/timeline`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
            const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
            if (username && password) {
                const authHeader = "Basic " + btoa(`${username}:${password}`);
                headers.set("Authorization", authHeader);
            }
            return headers;
        },
    }),

    tagTypes: ["Timeline"],
    endpoints: (builder) => ({
        getTimelines: builder.query({
            query: () => `/all-timeline`,
            providesTags: [{ type: "Timeline", id: "ACTIVE_LIST" }],
        }),
        getTimelineById: builder.query({
            query: (id) => `/fill-timeline-data?TimelineID=${id}`,
            providesTags: (result, error, id) => [{ type: "Timeline", id }],
        }),
        getActiveTimelines: builder.query({
            query: () => `/all-timelinedata`,
            providesTags: [{ type: "Timeline", id: "ACTIVE_LIST" }],
        }),
        saveOrUpdateTimeline: builder.mutation({
            query: (formData) => ({
                url: `/save-or-update-timeline`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [
                { type: "Timeline", id: "LIST" },
                { type: "Timeline", id: "ACTIVE_LIST" },
            ],
        }),
        deleteTimeline: builder.mutation({
            query: (TimelineID) => ({
                url: `/delete-timeline/${TimelineID}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, TimelineID) => [
                { type: "Timeline", id: TimelineID },
                { type: "Timeline", id: "LIST" },
                { type: "Timeline", id: "ACTIVE_LIST" },
            ],
        }),
        updateTimelineStatus: builder.mutation({
            query: ({ TimelineID, ActiveStatus }) => ({
                url: `/update-status`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { TimelineID, ActiveStatus },
            }),
            invalidatesTags: (result, error, { TimelineID }) => [
                { type: "Timeline", id: TimelineID },
                { type: "Timeline", id: "LIST" },
                { type: "Timeline", id: "ACTIVE_LIST" },
            ],
        }),
        updateDisplayOrder: builder.mutation({
            query: (data) => ({
                url: `/update-display-order`,
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            }),
            invalidatesTags: [
                { type: "Timeline", id: "LIST" },
                { type: "Timeline", id: "ACTIVE_LIST" },
            ],
        }),
        getMaxDisplayOrder: builder.query({
            query: () => `/max-display-order`,
            providesTags: [{ type: "Timeline", id: "MAX_ORDER" }],
        }),
    }),
});

export const {
    useGetTimelinesQuery,
    useGetTimelineByIdQuery,
    useGetActiveTimelinesQuery,
    useSaveOrUpdateTimelineMutation,
    useDeleteTimelineMutation,
    useUpdateTimelineStatusMutation,
    useUpdateDisplayOrderMutation,
    useGetMaxDisplayOrderQuery,
} = timelineAPISlice;