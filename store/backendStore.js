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
import { manufacturingAPISlice } from "./backendSlice/manufacturingAPISlice";
import { galleryAPISlice } from "./backendSlice/galleryAPISlice";
import { careerAPISlice } from "./backendSlice/careerAPISlice";
import { whatsNewAPISlice } from "./backendSlice/whatsNewAPISlice";
import { facilityCategoryAPISlice } from "./backendSlice/facilityCategoryAPISlice";
import { facilityProductAPISlice } from "./backendSlice/facilityProductAPISlice";
import { clientTypeAPISlice } from "./backendSlice/clientTypeAPISlice";
import { clientLogoMappingAPISlice } from "./backendSlice/clientLogoMappingAPISlice";
import { reportSummaryAPISlice } from "./backendSlice/reportSummaryAPISlice";
import { productAPISlice } from "./backendSlice/productAPISlice";
import modalReducer from "./slice/modalSlice";
import { metaAPISlice } from "./frontendSlice/metaAPISlice";
import { homePageAPISlice } from "./frontendSlice/homePageAPISlice";

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
    [partnerLogoAPI.reducerPath]: partnerLogoAPI.reducer,
    [manufacturingAPISlice.reducerPath]: manufacturingAPISlice.reducer,
    [galleryAPISlice.reducerPath]: galleryAPISlice.reducer,
    [careerAPISlice.reducerPath]: careerAPISlice.reducer,
    [whatsNewAPISlice.reducerPath]: whatsNewAPISlice.reducer,
    [facilityCategoryAPISlice.reducerPath]: facilityCategoryAPISlice.reducer,
    [facilityProductAPISlice.reducerPath]: facilityProductAPISlice.reducer,
    [clientTypeAPISlice.reducerPath]: clientTypeAPISlice.reducer,
    [clientLogoMappingAPISlice.reducerPath]: clientLogoMappingAPISlice.reducer,
    [reportSummaryAPISlice.reducerPath]: reportSummaryAPISlice.reducer,
    [productAPISlice.reducerPath]: productAPISlice.reducer,
    modal: modalReducer,
    [metaAPISlice.reducerPath]: metaAPISlice.reducer,
    [homePageAPISlice.reducerPath]: homePageAPISlice.reducer,
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
      manufacturingAPISlice.middleware,
      galleryAPISlice.middleware,
      careerAPISlice.middleware,
      whatsNewAPISlice.middleware,
      facilityCategoryAPISlice.middleware,
      facilityProductAPISlice.middleware,
      productAPISlice.middleware,
      clientTypeAPISlice.middleware,
      clientLogoMappingAPISlice.middleware,
      reportSummaryAPISlice.middleware,
      metaAPISlice.middleware,
      homePageAPISlice.middleware,
    ),
});
