import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IRoom, RoomsData } from "../../types/root";

export const chatRoomsApi = createApi({
  reducerPath: "chatRooms",
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
    getRooms: build.query<RoomsData, number>({
      query: (pageCount) => ({
        url: `/chatrooms?page=${pageCount}`,
      }),
      providesTags: [{ type: "Room", id: "Check" }],
    }),
    getRoomInfo: build.query<IRoom, number>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}`,
      }),
    }),
    createRoom: build.mutation<
      IRoom,
      {
        name: string;
        description: string;
      }
    >({
      query: (dataRoom) => ({
        url: `/chatrooms`,
        method: "POST",
        body: dataRoom,
      }),
      invalidatesTags: () => [{ type: "Room", id: "Check" }],
    }),
    changeStreamState: build.query<IRoom, number>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}/stream`,
      }),
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetRoomInfoQuery,
  useCreateRoomMutation,
  useLazyChangeStreamStateQuery,
} = chatRoomsApi;
