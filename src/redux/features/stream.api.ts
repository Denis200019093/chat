import { api } from "./api";

export const streamApi = api.injectEndpoints({
  endpoints: (build) => ({
    startStream: build.mutation<void, string | undefined>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}/stream`,
        method: "POST",
      }),
    }),
    stopStreaming: build.mutation<void, void>({
      query: () => ({
        url: `/stream`,
        method: "DELETE",
      }),
    }),
    startWatch: build.mutation<
      { id: number; streamer: string; viewers: string[] },
      string | null
    >({
      query: (streamerUsername) => ({
        url: `/stream/${streamerUsername}/watch`,
        method: "POST",
      }),
    }),
    stopWatching: build.mutation<void, string | null>({
      query: (streamerUsername) => ({
        url: `/stream/${streamerUsername}/watch`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useStartStreamMutation,
  useStartWatchMutation,
  useStopStreamingMutation,
  useStopWatchingMutation,
} = streamApi;
