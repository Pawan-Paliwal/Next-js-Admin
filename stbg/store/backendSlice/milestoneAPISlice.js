import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
    username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const milestoneAPISlice = createApi({
    reducerPath: "milestoneAPI",
    baseQuery: fetchBaseQuery({
        baseUrl: `${apiUrl}/milestone`,
        credentials: "include",
        prepareHeaders: (headers) => {
            if (authHeader) headers.set("Authorization", authHeader);
            return headers;
        },
    }),
    tagTypes: ["Milestone"],
    endpoints: (builder) => ({
        getAllMilestones: builder.query({
            query: () => `/all-milestones`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ MilestoneID }) => ({ type: "Milestone", id: MilestoneID })),
                        { type: "Milestone", id: "LIST" },
                    ]
                    : [{ type: "Milestone", id: "LIST" }],
        }),
        getMilestoneById: builder.query({
            query: (id) => `/fill-milestone-data?MilestoneID=${id}`,
            providesTags: (result, error, id) => [{ type: "Milestone", id }],
        }),
        saveOrUpdateMilestone: builder.mutation({
            query: (formData) => ({
                url: `/save-or-update-milestone`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [{ type: "Milestone", id: "LIST" }],
        }),

        deleteMilestone: builder.mutation({
            query: (MilestoneID) => ({
                url: `/delete-milestone/${MilestoneID}`,
                method: "DELETE",
            }),
            invalidatesTags: (r, e, MilestoneID) => [
                { type: "Milestone", id: MilestoneID },
                { type: "Milestone", id: "LIST" },
            ],
        }),

        updateMilestoneStatus: builder.mutation({
            query: ({ MilestoneID, ActiveStatus }) => ({
                url: `/update-status`,
                method: "POST",
                body: { MilestoneID, ActiveStatus },
            }),
            invalidatesTags: (r, e, { MilestoneID }) => [{ type: "Milestone", id: MilestoneID }],
        }),

        getMaxMilestoneDisplayOrder: builder.query({
            query: () => `/max-display-order`,
            providesTags: [{ type: "Milestone", id: "MAX_ORDER" }],
        }),

        updateMilestoneDisplayOrder: builder.mutation({
            query: (formData) => ({
                url: `/update-display-order`,
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: [{ type: "Milestone", id: "LIST" }],
        }),
    }),
});

export const {
    useGetAllMilestonesQuery,
    useGetMilestoneByIdQuery,
    useSaveOrUpdateMilestoneMutation,
    useDeleteMilestoneMutation,
    useUpdateMilestoneStatusMutation,
    useGetMaxMilestoneDisplayOrderQuery,
    useUpdateMilestoneDisplayOrderMutation,
} = milestoneAPISlice;
