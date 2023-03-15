import { chatRoomsApi } from "./chatRooms.api";
import { IMessage } from "../../types/root";

export const messagesApi = chatRoomsApi.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query<{ content: IMessage[] }, number>({
      query: (roomId) => ({
        url: `/chatrooms/${roomId}/messages`,
      }),
    }),
    sendMessage: build.mutation<
      IMessage[],
      { roomId: number; content: string }
    >({
      query: ({ content, roomId }) => ({
        url: `/chatrooms/${roomId}/messages`,
        method: "POST",
        body: {
          content,
        },
      }),
    }),
    deleteMessage: build.mutation<void, number>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
    }),
    editMessage: build.mutation<
      void,
      { content: string; messageId: number | null }
    >({
      query: ({ content, messageId }) => ({
        url: `/messages/${messageId}`,
        method: "PUT",
        body: {
          content,
        },
      }),
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useEditMessageMutation,
} = messagesApi;
