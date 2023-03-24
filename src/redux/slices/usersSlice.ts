import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserRoom } from "src/types/root";

interface IState {
  activeUsers: IUserRoom[];
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
    getActiveUsers(state, action: PayloadAction<IUserRoom[]>) {
      state.activeUsers = action.payload;
    },
    localSetActiveUser(state, action: PayloadAction<IUserRoom>) {
      const foundUser = state.activeUsers.find(
        (item) => item.username === action.payload.username
      );
      if (foundUser && !state.activeUsers.includes(foundUser)) {
        state.activeUsers = state.activeUsers.concat(action.payload);
      }
    },
    localDeleteActiveUser(state, action: PayloadAction<IUserRoom>) {
      state.activeUsers = state.activeUsers.filter(
        (user) => user.username !== action.payload.username
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
