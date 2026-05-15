import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const authHeader = username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const manufacturingAPISlice = createApi({
  reducerPath: "ManufacturingAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/manufacturing`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: ["Manufacturing"],
  endpoints: (builder) => ({
    getManufacturing: builder.query({
      query: () => `/all-manufacturing`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ ManufacturingID }) => ({ type: "Manufacturing", id: ManufacturingID })),
            { type: "Manufacturing", id: "LIST" },
          ]
          : [{ type: "Manufacturing", id: "LIST" }],
    }),

    getManufacturingById: builder.query({
      query: (id) => `/fill-manufacturing-data?ManufacturingID=${id}`,
      providesTags: (result, error, id) => [{ type: "Manufacturing", id }],
    }),

    saveOrUpdateManufacturing: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-manufacturing`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Manufacturing", id: "LIST" }],
    }),

    deleteManufacturing: builder.mutation({
      query: (ManufacturingID) => ({
        url: `/delete-manufacturing/${ManufacturingID}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, ManufacturingID) => [
        { type: "Manufacturing", id: ManufacturingID },
        { type: "Manufacturing", id: "LIST" },
      ],
    }),
    updateManufacturingStatus: builder.mutation({
      query: ({ ManufacturingID, ActiveStatus }) => ({
        url: `/update-status`,
        method: "POST",
        body: { ManufacturingID, ActiveStatus },
      }),
      invalidatesTags: (result, error, { ManufacturingID }) => [
        { type: "Manufacturing", id: ManufacturingID },
      ],
    }),
    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Manufacturing", id: "MAX_ORDER" }],
    }),
    updateDisplayOrder: builder.mutation({
      query: (formData) => ({
        url: `/update-display-order`,
        method: "POST",
        body: formData,
        formData: true
      }),
      invalidatesTags: [{ type: "Manufacturing", id: "LIST" }],
    }),
  }),
});

export const {
  useGetManufacturingQuery,
  useGetManufacturingByIdQuery,
  useSaveOrUpdateManufacturingMutation,
  useDeleteManufacturingMutation,
  useUpdateManufacturingStatusMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery
} = manufacturingAPISlice;
