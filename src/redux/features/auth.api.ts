import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query/fetchBaseQuery";
import { AuthData, IUser } from "../../types/root";
import { chatRoomsApi } from "./chatRooms.api";

export const authApi = chatRoomsApi.injectEndpoints({
  endpoints: (build) => ({
    signUp: build.mutation<
      { data: void } | { error: FetchBaseQueryError | SerializedError },
      AuthData
    >({
      query: ({ username, password }) => ({
        url: "/register",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),
    signIn: build.mutation<{ token: string }, AuthData>({
      query: ({ username, password }) => ({
        url: "/login",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),
    getMe: build.query<IUser, void>({
      query: () => ({
        url: "/user",
      }),
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation, useGetMeQuery } = authApi;
