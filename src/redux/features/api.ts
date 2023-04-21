import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["Room", "Message"],
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders: (headers, { endpoint }) => {
      const token = document.cookie.match("token")?.input?.slice(6);

      if (token && endpoint !== "signUp" && endpoint !== "signIn")
        headers.set("Authorization", `Bearer ${token}`);

      return headers;
    },
  }),
  endpoints: (build) => ({
    uploadAvatar: build.mutation<string, FormData>({
      query: (file) => ({
        url: "/user/avatar",
        method: "POST",
        body: file,
      }),
    }),
  }),
});

export const { useUploadAvatarMutation } = api;
