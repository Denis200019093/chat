import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IMessage } from "../../types/root";

interface IState {
  messages: IMessage[];
  editStatus: {
    isEditing: boolean;
    messageId: number | null;
    messageContent: string;
  };
  roomId: number;
}

const initialState: IState = {
  messages: [],
  roomId: 0,
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
      state.messages = action.payload;
    },
    localAddMessage(state, action: PayloadAction<IMessage>) {
      state.messages = state.messages.concat(action.payload);
    },
    localDeleteMessage(state, action: PayloadAction<number>) {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
    localEditMessage(
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
    getRoomId(state, action: PayloadAction<number>) {
      state.roomId = action.payload;
    },
  },
});

export const {
  getMessages,
  localAddMessage,
  localDeleteMessage,
  localEditMessage,
  getRoomId,
  startEdit,
  endEdit,
} = messagesSlice.actions;
export const messagesReducer = messagesSlice.reducer;
