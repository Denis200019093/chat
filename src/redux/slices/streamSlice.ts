import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  isReadyToWatch: boolean;
  isReadyToStream: boolean;
  isWatching: boolean;
}

const initialState: IState = {
  isReadyToWatch: false,
  isReadyToStream: false,
  isWatching: false,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
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
  unsetReadyWatch,
  setReadyStream,
  unsetReadyStream,
} = streamSlice.actions;
export const streamReducer = streamSlice.reducer;
