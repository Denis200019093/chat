import { IRoom } from "src/types/root";
import { api } from "./api";

export const streamApi = api.injectEndpoints({
  endpoints: (build) => ({
    startStream: build.query<void, string | undefined>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}/stream/start`,
      }),
    }),
    endStream: build.query<void, void>({
      query: () => ({
        url: "/stream/end",
      }),
    }),
    changeStreamState: build.query<IRoom, number>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}/stream`,
      }),
    }),
  }),
});

export const { useLazyStartStreamQuery, useLazyEndStreamQuery } = streamApi;
