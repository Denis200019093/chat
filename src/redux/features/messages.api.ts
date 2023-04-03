import { IMessage, MessagesData } from "../../types/root";
import { api } from "./api";

export const messagesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query<
      MessagesData,
      { roomId: string | undefined; pageCount: number }
    >({
      query: ({ roomId, pageCount }) => ({
        url: `/chatrooms/${roomId}/messages?page=${pageCount}`,
      }),
    }),
    sendMessage: build.mutation<
      IMessage[],
      { roomId: string | undefined; content: string }
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
