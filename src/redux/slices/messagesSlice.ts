import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMessage } from "../../types/root";

interface IState {
  messages: IMessage[];
  editStatus: {
    isEditing: boolean;
    messageId: number | null;
    messageContent: string;
  };
}

const initialState: IState = {
  messages: [],
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
    getMessages(state, action: PayloadAction<IMessage[]>) {
      // state.messages = action.payload;
      state.messages = [...action.payload, ...state.messages];
    },
    addMessage(state, action: PayloadAction<IMessage>) {
      state.messages = [...state.messages, action.payload];
    },
    deleteMessage(state, action: PayloadAction<number>) {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
    editMessage(
      state,
      action: PayloadAction<{ content: string; messageId: number }>
    ) {
      state.messages = state.messages.map((message) => {
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
      state.messages = [];
    },
  },
});

export const {
  getMessages,
  addMessage,
  deleteMessage,
  editMessage,
  startEdit,
  endEdit,
  clear,
} = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
