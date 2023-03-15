import { createSlice } from "@reduxjs/toolkit";

interface IState {
  streamStarted: boolean;
}

const initialState: IState = {
  streamStarted: false,
};

const modesSlice = createSlice({
  name: "modes",
  initialState,
  reducers: {
    onDefaultMode(state) {
      state.streamStarted = true;
    },
    offDefaultMode(state) {
      state.streamStarted = false;
    },
  },
});

export const { onDefaultMode, offDefaultMode } = modesSlice.actions;
export const modesReducer = modesSlice.reducer;
