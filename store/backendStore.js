// store/backendStore.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./backendSlice/authReducer";
import { authAPISlice } from "./backendSlice/authAPISlice";
import { staticAPISlice } from "./backendSlice/staticAPISlice";
import { contactUsAPISlice } from "./backendSlice/contactUsAPISlice";
import { awardAPISlice } from "./backendSlice/awardAPISlice";
import { testimonialAPISlice } from "./backendSlice/testimonialAPISlice";
import { collaborationAPISlice } from "./backendSlice/collaborationAPISlice";
import { directorAPISlice } from "./backendSlice/directorAPISlice";
import { companyAPISlice } from "./backendSlice/companyAPISlice";
import { milestoneAPISlice } from "./backendSlice/milestoneAPISlice";
import { blogAPISlice } from "./backendSlice/blogAPISlice";
import { partnerLogoAPI } from "./backendSlice/partnerLogoAPISlice";

export const backendStore = configureStore({
  reducer: {
    auth: authReducer,
    [authAPISlice.reducerPath]: authAPISlice.reducer,
    [staticAPISlice.reducerPath]: staticAPISlice.reducer,
    [contactUsAPISlice.reducerPath]: contactUsAPISlice.reducer,
    [awardAPISlice.reducerPath]: awardAPISlice.reducer,
    [testimonialAPISlice.reducerPath]: testimonialAPISlice.reducer,
    [collaborationAPISlice.reducerPath]: collaborationAPISlice.reducer,
    [directorAPISlice.reducerPath]: directorAPISlice.reducer,
    [companyAPISlice.reducerPath]: companyAPISlice.reducer,
    [milestoneAPISlice.reducerPath]: milestoneAPISlice.reducer,
    [blogAPISlice.reducerPath]: blogAPISlice.reducer,
    [partnerLogoAPI.reducerPath]: partnerLogoAPI.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPISlice.middleware,
      staticAPISlice.middleware,
      contactUsAPISlice.middleware,
      awardAPISlice.middleware,
      testimonialAPISlice.middleware,
      collaborationAPISlice.middleware,
      directorAPISlice.middleware,
      companyAPISlice.middleware,
      milestoneAPISlice.middleware,
      blogAPISlice.middleware,
      partnerLogoAPI.middleware,
    ),
});