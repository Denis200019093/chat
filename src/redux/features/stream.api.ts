import { chatRoomsApi } from "./chatRooms.api";

export const streamApi = chatRoomsApi.injectEndpoints({
  endpoints: (build) => ({
    startStream: build.query<void, number>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}/stream/start`,
      }),
    }),
    endStream: build.query<void, void>({
      query: () => ({
        url: "/stream/end",
      }),
    }),
  }),
});

export const { useLazyStartStreamQuery, useLazyEndStreamQuery } = streamApi;
