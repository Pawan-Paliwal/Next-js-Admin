// store/frontendStore.js
import { configureStore } from "@reduxjs/toolkit";
import { metaAPISlice } from "./frontendSlice/metaAPISlice";
import { apiSlice } from "./frontendSlice/apiSlice";
import { contactUsAPISlice } from "./backendSlice/contactUsAPISlice";
import { homeAPISlice } from "./backendSlice/homeAPISlice";
import { masterAPISlice } from "./backendSlice/masterAPISlice";
import { productAPISlice } from "./backendSlice/productAPISlice";
import { careerEnquiryApi } from "./backendSlice/careerEnquiryApi";

export const frontendStore = configureStore({
  reducer: {
    [metaAPISlice.reducerPath]: metaAPISlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [contactUsAPISlice.reducerPath]: contactUsAPISlice.reducer,
    [homeAPISlice.reducerPath]: homeAPISlice.reducer,
    [masterAPISlice.reducerPath]: masterAPISlice.reducer,
    [productAPISlice.reducerPath]: productAPISlice.reducer,
    [careerEnquiryApi.reducerPath]: careerEnquiryApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      metaAPISlice.middleware,
      apiSlice.middleware,
      contactUsAPISlice.middleware,
      homeAPISlice.middleware,
      masterAPISlice.middleware,
      productAPISlice.middleware,
      careerEnquiryApi.middleware
    ),
});
