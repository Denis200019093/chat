import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMessage, MessagesData } from "../../types/root";

interface IState {
  messages: {
    content: IMessage[];
    totalPages: number | null;
    currentRoomId: string | null | undefined;
  };
  offset: number;
  editStatus: {
    isEditing: boolean;
    messageId: number | null;
    messageContent: string;
  };
}

const initialState: IState = {
  messages: {
    content: [],
    totalPages: null,
    currentRoomId: null,
  },
  offset: 0,
  editStatus: {
    isEditing: false,
    messageId: null,
    messageContent: "",
  },
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    getMessages(state, action: PayloadAction<MessagesData>) {
      state.messages = {
        content: [...state.messages.content, ...action.payload.content],
        // content: [...action.payload.content, ...state.messages.content],
        totalPages: action.payload.totalPages,
        currentRoomId: action.payload.currentRoomId,
      };
    },
    nextPage(state) {
      state.offset = state.messages.content.length;
    },
    clearPageCount(state) {
      state.offset = 0;
    },
    addMessage(state, action: PayloadAction<IMessage>) {
      state.messages.content = [...state.messages.content, action.payload];
    },
    deleteMessage(state, action: PayloadAction<number>) {
      state.messages.content = state.messages.content.filter(
        (message) => message.id !== action.payload
      );
    },
    editMessage(
      state,
      action: PayloadAction<{ content: string; messageId: number }>
    ) {
      state.messages.content = state.messages.content.map((message) => {
        if (message.id === action.payload.messageId) {
          return {
            ...message,
            content: action.payload.content,
          };
        }

        return message;
      });
    },
    startEdit(
      state,
      action: PayloadAction<{ messageId: number; messageContent: string }>
    ) {
      state.editStatus = {
        isEditing: true,
        messageId: action.payload.messageId,
        messageContent: action.payload.messageContent,
      };
    },
    endEdit(state) {
      state.editStatus = {
        isEditing: false,
        messageId: null,
        messageContent: "",
      };
    },
    clear(state) {
      state.messages.content = [];
      state.messages.totalPages = null;
      state.messages.currentRoomId = null;
    },
  },
});

export const {
  getMessages,
  nextPage,
  addMessage,
  deleteMessage,
  editMessage,
  startEdit,
  endEdit,
  clear,
  clearPageCount,
} = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
