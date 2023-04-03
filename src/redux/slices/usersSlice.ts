import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserBasicData } from "src/types/root";

type UserData = IUser | IUserBasicData;

interface IState {
  activeUsers: IUser[];
  me: UserData | null;
}

const initialState: IState = {
  activeUsers: [],
  me: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    getMe(state, action: PayloadAction<UserData>) {
      state.me = action.payload;
    },
    getActiveUsers(state, action: PayloadAction<IUser[]>) {
      state.activeUsers = action.payload;
    },
    setActiveUser(state, action: PayloadAction<UserData>) {
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
