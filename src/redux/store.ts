import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { api } from "./features/api";
import { modesReducer } from "./slices/modesSlice";
import { usersReducer } from "./slices/usersSlice";
import { streamReducer } from "./slices/streamSlice";
import { messagesReducer } from "./slices/messagesSlice";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  modes: modesReducer,
  messages: messagesReducer,
  users: usersReducer,
  stream: streamReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];
