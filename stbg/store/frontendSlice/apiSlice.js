import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";
import { getCookie } from "../../utils/cookieService";

const javaBackendUrl = process.env.NEXT_PUBLIC_JAVA_BACKEND_URL;
const basicAuthPass = process.env.NEXT_PUBLIC_BASIC_AUTH_TOKEN;

// Get access token from cookie (can be reused across multiple endpoints)
const getAccessToken = () => getCookie('access_token');

// Sanitize function using DOMPurify
const sanitize = (value) => {
  if (typeof value !== "string") return value;
  return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: fetchBaseQuery({
    baseUrl: javaBackendUrl,
  }),
  endpoints: (builder) => ({
    loginWithJava: builder.mutation({
      query: ({ email, password, authority }) => {
        // Transform email: lowercase -> base64 -> sanitize
        const emailLower = email.toLowerCase();
        const emailBase64 = btoa(emailLower);
        const sanitizedEmail = sanitize(emailBase64);

        // Transform password: MD5 hash -> sanitize
        const passwordMD5 = CryptoJS.MD5(password).toString();
        const sanitizedPassword = sanitize(passwordMD5);

        // Sanitize other fields
        const sanitizedGrantType = sanitize("password");
        const sanitizedAuthority = sanitize(authority);

        // Build URL-encoded body
        const body = new URLSearchParams({
          grant_type: sanitizedGrantType,
          username: sanitizedEmail,
          password: sanitizedPassword,
          authority: sanitizedAuthority,
        }).toString();

        return {
          url: "/oauth/token",
          method: "POST",
          body: body,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Authorization": `Basic ${basicAuthPass}`,
          },
        };
      },
    }),
    getUserRoles: builder.query({
      query: () => ({
        url: "/admin/user/get/role",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
      }),
    }),
    saveActiveRole: builder.mutation({
      query: (body) => ({
        url: "/admin/user/save/activerole",
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getAccessToken()}`,
        },
      }),
    }),
  }),
});

export const { useLoginWithJavaMutation, useLazyGetUserRolesQuery, useSaveActiveRoleMutation } = apiSlice;
