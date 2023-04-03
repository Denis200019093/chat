import { AuthData, IUser, ResponseWithToken } from "../../types/root";
import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    signUp: build.mutation<void, AuthData>({
      query: ({ username, password }) => ({
        url: "/register",
        method: "POST",
        body: {
          username,
          password,
        },
      }),
    }),
    signIn: build.mutation<ResponseWithToken, AuthData>({
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
