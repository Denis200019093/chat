import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  streamerUsername: string | null;
  isReadyToWatch: boolean;
  isReadyToStream: boolean;
}

const initialState: IState = {
  streamerUsername: null,
  isReadyToWatch: false,
  isReadyToStream: false,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setStreamerUsername(state, action: PayloadAction<string>) {
      state.streamerUsername = action.payload;
    },
    setReadyWatch(state) {
      state.isReadyToWatch = true;
      state.isReadyToStream = false;
    },
    unsetReadyWatch(state) {
      state.isReadyToWatch = false;
    },
    setReadyStream(state) {
      state.isReadyToStream = true;
      state.isReadyToWatch = false;
    },
    unsetReadyStream(state) {
      state.isReadyToStream = false;
    },
  },
});

export const {
  setReadyWatch,
  setStreamerUsername,
  unsetReadyWatch,
  setReadyStream,
  unsetReadyStream,
} = streamSlice.actions;
export const streamReducer = streamSlice.reducer;
