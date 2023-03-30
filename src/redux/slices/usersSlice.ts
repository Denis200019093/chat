import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserRoom, IUserBasicData } from "src/types/root";

interface IState {
  activeUsers: IUserRoom[];
  me: IUser | IUserBasicData | null;
}

const initialState: IState = {
  activeUsers: [],
  me: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getMe(state, action: PayloadAction<IUser | IUserBasicData>) {
      state.me = action.payload;
    },
    getActiveUsers(state, action: PayloadAction<IUserRoom[]>) {
      state.activeUsers = action.payload;
    },
    setActiveUser(state, action: PayloadAction<IUserRoom>) {
      const foundUser = state.activeUsers.find(
        (item) => item.username === action.payload.username
      );

      if (!foundUser)
        state.activeUsers = state.activeUsers.concat(action.payload);
    },
    deleteActiveUser(state, action: PayloadAction<string>) {
      state.activeUsers = state.activeUsers.filter(
        (user) => user.username !== action.payload
      );
    },
    setUserStreamingTrue(state, action: PayloadAction<string>) {
      state.activeUsers.map((item) => {
        if (item.username === action.payload) {
          return (item.userStreaming = true);
        }
      });
    },
    setUserStreamingFalse(state, action: PayloadAction<string>) {
      state.activeUsers.map((item) => {
        if (item.username === action.payload) {
          return (item.userStreaming = false);
        }
      });
    },
  },
});

export const {
  getActiveUsers,
  setActiveUser,
  deleteActiveUser,
  getMe,
  setUserStreamingTrue,
  setUserStreamingFalse,
} = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
