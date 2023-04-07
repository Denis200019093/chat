import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser, IUserBasicData, StreamerData } from "src/types/root";

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
    setActiveUser(state, action: PayloadAction<IUser>) {
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
    setStreamStatusOfUser(state, action: PayloadAction<StreamerData>) {
      state.activeUsers = state.activeUsers.map((streamer) => {
        if (streamer.username === action.payload.streamer) {
          return {
            ...streamer,
            stream: action.payload,
          };
        }
        return streamer;
      });
    },
    deleteStreamStatusOfUser(state, action: PayloadAction<string>) {
      state.activeUsers = state.activeUsers.map((streamer) => {
        if (streamer.username === action.payload) {
          return {
            ...streamer,
            stream: (streamer.stream = null),
          };
        }
        return streamer;
      });
    },
    setViewer(
      state,
      action: PayloadAction<{
        viewerUsername: string;
        streamerName: string;
      }>
    ) {
      state.activeUsers = state.activeUsers.map((streamer) => {
        if (
          streamer.username === action.payload.streamerName &&
          streamer.stream
        ) {
          return {
            ...streamer,
            stream: {
              ...streamer.stream,
              viewers: [
                ...streamer.stream.viewers,
                action.payload.viewerUsername,
              ],
            },
          };
        }
        return streamer;
      });
    },
    deleteViewer(
      state,
      action: PayloadAction<{
        viewerUsername: string;
        streamerName: string;
      }>
    ) {
      state.activeUsers = state.activeUsers.map((streamer) => {
        if (
          streamer.stream &&
          streamer.stream.viewers.includes(action.payload.viewerUsername) &&
          streamer.username === action.payload.streamerName
        ) {
          return {
            ...streamer,
            stream: {
              ...streamer.stream,
              viewers: streamer.stream.viewers.filter(
                (viewer) => viewer !== action.payload.viewerUsername
              ),
            },
          };
        }
        return streamer;
      });
    },
  },
});

export const {
  getActiveUsers,
  setActiveUser,
  deleteActiveUser,
  getMe,
  setViewer,
  deleteViewer,
  setStreamStatusOfUser,
  deleteStreamStatusOfUser,
} = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
