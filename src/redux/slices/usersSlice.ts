import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "src/types/root";

interface IState {
  activeUsers: string[];
  me: IUser | null;
}

const initialState: IState = {
  activeUsers: [],
  me: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getMe(state, action: PayloadAction<IUser>) {
      state.me = action.payload;
    },
    getActiveUsers(state, action: PayloadAction<string[]>) {
      state.activeUsers = action.payload;
    },
    localSetActiveUser(state, action: PayloadAction<string>) {
      const newUser = action.payload;
      if (!state.activeUsers.includes(newUser)) {
        state.activeUsers = state.activeUsers.concat(action.payload);
      }
    },
    localDeleteActiveUser(state, action: PayloadAction<string>) {
      state.activeUsers = state.activeUsers.filter(
        (user) => user !== action.payload
      );
    },
  },
});

export const {
  getActiveUsers,
  localSetActiveUser,
  localDeleteActiveUser,
  getMe,
} = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
