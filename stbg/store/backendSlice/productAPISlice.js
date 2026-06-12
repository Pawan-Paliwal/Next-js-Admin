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
    tagTypes: ["Product", "SectionItem"],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => `/all-products`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ ProductId }) => ({ type: "Product", id: ProductId })),
                        { type: "Product", id: "LIST" },
                    ]
                    : [{ type: "Product", id: "LIST" }],
        }),
        getActiveProducts: builder.query({
            query: () => `/get-activeProducts`,
            providesTags: (result) =>
                result?.products
                    ? [
                        ...result.products.map(({ ProductId }) => ({ type: "Product", id: ProductId })),
                        { type: "Product", id: "ACTIVE_LIST" },
                    ]
                    : [{ type: "Product", id: "ACTIVE_LIST" }],
        }),

        getProductById: builder.query({
            query: (id) => `/fill-product-data?ProductId=${id}`,
            providesTags: (result, error, id) => [{ type: "Product", id }],
        }),

        saveOrUpdateProduct: builder.mutation({
            query: (formData) => ({
                url: `/save-or-update-product`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: [{ type: "Product", id: "LIST" }],
        }),

        deleteProduct: builder.mutation({
            query: (ProductId) => ({
                url: `/delete-product/${ProductId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, ProductId) => [
                { type: "Product", id: ProductId },
                { type: "Product", id: "LIST" },
            ],
        }),

        updateProductStatus: builder.mutation({
            query: ({ ProductId, ActiveStatus }) => ({
                url: `/update-status`,
                method: "POST",
                body: { ProductId, ActiveStatus },
            }),
            invalidatesTags: (result, error, { ProductId }) => [
                { type: "Product", id: ProductId },
            ],
        }),
        getSectionItems: builder.query({
            query: ({ ProductId, SectionNumber }) =>
                `/section-items?ProductId=${ProductId}&SectionNumber=${SectionNumber}`,
            providesTags: (result, error, { ProductId, SectionNumber }) =>
                result?.data
                    ? [
                        ...result.data.map(({ ItemId }) => ({ type: "SectionItem", id: ItemId })),
                        { type: "SectionItem", id: `${ProductId}-${SectionNumber}` },
                    ]
                    : [{ type: "SectionItem", id: `${ProductId}-${SectionNumber}` }],
        }),
        saveOrUpdateSectionItem: builder.mutation({
            query: (formData) => ({
                url: `/save-or-update-section-item`,
                method: "POST",
                body: formData,
                formData: true,
            }),
            invalidatesTags: (result, error, formData) => {
                const ProductId = formData.get('ProductId');
                const SectionNumber = formData.get('SectionNumber');
                return [{ type: "SectionItem", id: `${ProductId}-${SectionNumber}` }];
            },
        }),
        deleteSectionItem: builder.mutation({
            query: (ItemId) => ({
                url: `/delete-section-item/${ItemId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, ItemId) => [
                { type: "SectionItem", id: ItemId },
            ],
        }),
        getProductPageData: builder.query({
            query: (slug) => `/project_data/${slug}`,
            providesTags: (result, error, slug) => [{ type: "Product", id: slug }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useSaveOrUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateProductStatusMutation,
    useGetSectionItemsQuery,
    useSaveOrUpdateSectionItemMutation,
    useDeleteSectionItemMutation,
    useGetActiveProductsQuery,
    useGetProductPageDataQuery
} = productAPISlice;