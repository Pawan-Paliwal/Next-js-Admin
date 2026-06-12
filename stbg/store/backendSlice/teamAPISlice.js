import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const teamAPISlice = createApi({
  reducerPath: "teamAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/team`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getAllTeamMembers: builder.query({
      query: () => `/all-team-members`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ TeamID }) => ({ type: "Team", id: TeamID })),
            { type: "Team", id: "LIST" },
          ]
          : [{ type: "Team", id: "LIST" }],
    }),

    getTeamMemberById: builder.query({
      query: (id) => `/fill-team-data?TeamID=${id}`,
      providesTags: (result, error, id) => [{ type: "Team", id }],
    }),

    saveOrUpdateTeamMember: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-team`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),

    deleteTeamMember: builder.mutation({
      query: (TeamID) => ({
        url: `/delete-team/${TeamID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, TeamID) => [
        { type: "Team", id: TeamID },
        { type: "Team", id: "LIST" },
      ],
    }),

    updateDisplayOrder: builder.mutation({
      query: (formData) => ({
        url: `/update-display-order`,
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),

    updateTeamMemberStatus: builder.mutation({
      query: ({ TeamID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { TeamID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { TeamID }) => [{ type: "Team", id: TeamID }],
    }),

    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Team", id: "MAX_ORDER" }],
    }),
  }),
});

export const {
  useGetAllTeamMembersQuery,
  useGetTeamMemberByIdQuery,
  useSaveOrUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useUpdateDisplayOrderMutation,
  useUpdateTeamMemberStatusMutation,
  useGetMaxDisplayOrderQuery,
} = teamAPISlice;