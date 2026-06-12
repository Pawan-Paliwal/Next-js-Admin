import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USER;
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASS;
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const authHeader =
  username && password ? "Basic " + btoa(`${username}:${password}`) : "";

export const productAPISlice = createApi({
  reducerPath: "productAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/product`,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (authHeader) {
        headers.set("Authorization", authHeader);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Product",
    "Highlight",
    "Gallery",
    "Circuit",
    "Technology",
    "Drive",
  ],
  endpoints: (builder) => ({
    // ─── PRODUCT ────────────────────────────────────────────────────────────
    getProducts: builder.query({
      query: () => `/all-products`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ ProductId }) => ({
                type: "Product",
                id: ProductId,
              })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    getActiveProducts: builder.query({
      query: () => `/get-active-products`,
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ ProductId }) => ({
                type: "Product",
                id: ProductId,
              })),
              { type: "Product", id: "ACTIVE_LIST" },
            ]
          : [{ type: "Product", id: "ACTIVE_LIST" }],
    }),

    getProductById: builder.query({
      query: (id) => `/fill-product-data?ProductId=${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    getProductBySlug: builder.query({
      query: (slug) => `/product/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
    }),

    getProductBySlugPublic: builder.query({
      query: (slug) => `/product-data/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
    }),

    saveOrUpdateProduct: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-product`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "ACTIVE_LIST" },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (ProductId) => ({
        url: `/delete-product/${ProductId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, ProductId) => [
        { type: "Product", id: ProductId },
        { type: "Product", id: "LIST" },
        { type: "Product", id: "ACTIVE_LIST" },
      ],
    }),

    updateProductStatus: builder.mutation({
      query: ({ ProductId, ActiveStatus }) => ({
        url: `/update-product-status`,
        method: "POST",
        body: { ProductId, ActiveStatus },
      }),
      invalidatesTags: (result, error, { ProductId }) => [
        { type: "Product", id: ProductId },
        { type: "Product", id: "ACTIVE_LIST" },
      ],
    }),

    updateDisplayOrder: builder.mutation({
      query: (data) => ({
        url: `/update-display-order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    getMaxDisplayOrder: builder.query({
      query: () => `/max-display-order`,
      providesTags: [{ type: "Product", id: "LIST" }],
    }),

    // ─── HIGHLIGHTS ─────────────────────────────────────────────────────────
    getHighlightsByProduct: builder.query({
      query: (ProductId) => `/highlights?ProductId=${ProductId}`,
      providesTags: (result, error, ProductId) =>
        result?.data
          ? [
              ...result.data.map(({ HighlightId }) => ({
                type: "Highlight",
                id: HighlightId,
              })),
              { type: "Highlight", id: `PRODUCT-${ProductId}` },
            ]
          : [{ type: "Highlight", id: `PRODUCT-${ProductId}` }],
    }),

    saveOrUpdateHighlight: builder.mutation({
      query: (body) => ({
        url: `/save-or-update-highlight`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { ProductId }) => [
        { type: "Highlight", id: `PRODUCT-${ProductId}` },
      ],
    }),

    deleteHighlight: builder.mutation({
      query: (HighlightId) => ({
        url: `/delete-highlight/${HighlightId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, HighlightId) => [
        { type: "Highlight", id: HighlightId },
      ],
    }),

    updateHighlightStatus: builder.mutation({
      query: ({ HighlightId, ActiveStatus }) => ({
        url: `/update-highlight-status`,
        method: "POST",
        body: { HighlightId, ActiveStatus },
      }),
      invalidatesTags: (result, error, { HighlightId }) => [
        { type: "Highlight", id: HighlightId },
      ],
    }),

    // ─── GALLERY ────────────────────────────────────────────────────────────
    getGalleryByProduct: builder.query({
      query: (ProductId) => `/gallery?ProductId=${ProductId}`,
      providesTags: (result, error, ProductId) =>
        result?.data
          ? [
              ...result.data.map(({ GalleryId }) => ({
                type: "Gallery",
                id: GalleryId,
              })),
              { type: "Gallery", id: `PRODUCT-${ProductId}` },
            ]
          : [{ type: "Gallery", id: `PRODUCT-${ProductId}` }],
    }),

    saveOrUpdateGallery: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-gallery`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [
        { type: "Gallery", id: `PRODUCT-${formData.get("ProductId")}` },
      ],
    }),

    deleteGallery: builder.mutation({
      query: (GalleryId) => ({
        url: `/delete-gallery/${GalleryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, GalleryId) => [
        { type: "Gallery", id: GalleryId },
      ],
    }),

    updateGalleryStatus: builder.mutation({
      query: ({ GalleryId, ActiveStatus }) => ({
        url: `/update-gallery-status`,
        method: "POST",
        body: { GalleryId, ActiveStatus },
      }),
      invalidatesTags: (result, error, { GalleryId }) => [
        { type: "Gallery", id: GalleryId },
      ],
    }),

    // ─── CIRCUITS ───────────────────────────────────────────────────────────
    getCircuitsByProduct: builder.query({
      query: (ProductId) => `/circuits?ProductId=${ProductId}`,
      providesTags: (result, error, ProductId) =>
        result?.data
          ? [
              ...result.data.map(({ CircuitId }) => ({
                type: "Circuit",
                id: CircuitId,
              })),
              { type: "Circuit", id: `PRODUCT-${ProductId}` },
            ]
          : [{ type: "Circuit", id: `PRODUCT-${ProductId}` }],
    }),

    saveOrUpdateCircuit: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-circuit`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [
        { type: "Circuit", id: `PRODUCT-${formData.get("ProductId")}` },
      ],
    }),

    deleteCircuit: builder.mutation({
      query: (CircuitId) => ({
        url: `/delete-circuit/${CircuitId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, CircuitId) => [
        { type: "Circuit", id: CircuitId },
      ],
    }),

    updateCircuitStatus: builder.mutation({
      query: ({ CircuitId, ActiveStatus }) => ({
        url: `/update-circuit-status`,
        method: "POST",
        body: { CircuitId, ActiveStatus },
      }),
      invalidatesTags: (result, error, { CircuitId }) => [
        { type: "Circuit", id: CircuitId },
      ],
    }),

    // ─── TECHNOLOGY ─────────────────────────────────────────────────────────
    getTechnologyByProduct: builder.query({
      query: (ProductId) => `/technology?ProductId=${ProductId}`,
      providesTags: (result, error, ProductId) =>
        result?.data
          ? [
              ...result.data.map(({ TechnologyId }) => ({
                type: "Technology",
                id: TechnologyId,
              })),
              { type: "Technology", id: `PRODUCT-${ProductId}` },
            ]
          : [{ type: "Technology", id: `PRODUCT-${ProductId}` }],
    }),

    saveOrUpdateTechnology: builder.mutation({
      query: (body) => ({
        url: `/save-or-update-technology`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { ProductId }) => [
        { type: "Technology", id: `PRODUCT-${ProductId}` },
      ],
    }),

    deleteTechnology: builder.mutation({
      query: (TechnologyId) => ({
        url: `/delete-technology/${TechnologyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, TechnologyId) => [
        { type: "Technology", id: TechnologyId },
      ],
    }),

    updateTechnologyStatus: builder.mutation({
      query: ({ TechnologyId, ActiveStatus }) => ({
        url: `/update-technology-status`,
        method: "POST",
        body: { TechnologyId, ActiveStatus },
      }),
      invalidatesTags: (result, error, { TechnologyId }) => [
        { type: "Technology", id: TechnologyId },
      ],
    }),

    // ─── DRIVES ─────────────────────────────────────────────────────────────
    getDrivesByProduct: builder.query({
      query: (ProductId) => `/drives?ProductId=${ProductId}`,
      providesTags: (result, error, ProductId) =>
        result?.data
          ? [
              ...result.data.map(({ DriveId }) => ({
                type: "Drive",
                id: DriveId,
              })),
              { type: "Drive", id: `PRODUCT-${ProductId}` },
            ]
          : [{ type: "Drive", id: `PRODUCT-${ProductId}` }],
    }),

    saveOrUpdateDrive: builder.mutation({
      query: (formData) => ({
        url: `/save-or-update-drive`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, formData) => [
        { type: "Drive", id: `PRODUCT-${formData.get("ProductId")}` },
      ],
    }),

    deleteDrive: builder.mutation({
      query: (DriveId) => ({
        url: `/delete-drive/${DriveId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, DriveId) => [
        { type: "Drive", id: DriveId },
      ],
    }),

    updateDriveStatus: builder.mutation({
      query: ({ DriveId, ActiveStatus }) => ({
        url: `/update-drive-status`,
        method: "POST",
        body: { DriveId, ActiveStatus },
      }),
      invalidatesTags: (result, error, { DriveId }) => [
        { type: "Drive", id: DriveId },
      ],
    }),
  }),
});

export const {
  // Product
  useGetProductsQuery,
  useGetActiveProductsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetProductBySlugPublicQuery,
  useSaveOrUpdateProductMutation,
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
  useUpdateDisplayOrderMutation,
  useGetMaxDisplayOrderQuery,
  // Highlights
  useGetHighlightsByProductQuery,
  useSaveOrUpdateHighlightMutation,
  useDeleteHighlightMutation,
  useUpdateHighlightStatusMutation,
  // Gallery
  useGetGalleryByProductQuery,
  useSaveOrUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useUpdateGalleryStatusMutation,
  // Circuits
  useGetCircuitsByProductQuery,
  useSaveOrUpdateCircuitMutation,
  useDeleteCircuitMutation,
  useUpdateCircuitStatusMutation,
  // Technology
  useGetTechnologyByProductQuery,
  useSaveOrUpdateTechnologyMutation,
  useDeleteTechnologyMutation,
  useUpdateTechnologyStatusMutation,
  // Drives
  useGetDrivesByProductQuery,
  useSaveOrUpdateDriveMutation,
  useDeleteDriveMutation,
  useUpdateDriveStatusMutation,
} = productAPISlice;
