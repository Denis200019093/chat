import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { chatRoomsApi } from "./features/chatRooms.api";

import { messagesReducer } from "./slices/messagesSlice";
import { modesReducer } from "./slices/modesSlice";
import { usersReducer } from "./slices/usersSlice";
import { streamReducer } from "./slices/streamSlice";
import { roomReducer } from "./slices/roomSlice";

const rootReducer = combineReducers({
  [chatRoomsApi.reducerPath]: chatRoomsApi.reducer,
  modes: modesReducer,
  messages: messagesReducer,
  users: usersReducer,
  stream: streamReducer,
  room: roomReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(chatRoomsApi.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
