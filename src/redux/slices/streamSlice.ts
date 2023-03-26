import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  streamId: string | null;
  isReadyToWatch: boolean;
  isReadyToStream: boolean;
}

const initialState: IState = {
  streamId: null,
  isReadyToWatch: false,
  isReadyToStream: false,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setStreamId(state, action: PayloadAction<string>) {
      state.streamId = action.payload;
    },
    unsetStreamId(state) {
      state.streamId = null;
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
  unsetReadyWatch,
  setReadyStream,
  unsetReadyStream,
  setStreamId,
  unsetStreamId,
} = streamSlice.actions;
export const streamReducer = streamSlice.reducer;
