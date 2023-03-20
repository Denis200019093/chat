import { createSlice } from "@reduxjs/toolkit";

interface IState {
  streamStarted: boolean;
  creatingRoom: boolean;
}

const initialState: IState = {
  streamStarted: false,
  creatingRoom: false,
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
    showCreateRoomModal(state) {
      state.creatingRoom = true;
    },
    hideCreateRoomModal(state) {
      state.creatingRoom = false;
    },
  },
});

export const {
  onDefaultMode,
  offDefaultMode,
  showCreateRoomModal,
  hideCreateRoomModal,
} = modesSlice.actions;
export const modesReducer = modesSlice.reducer;
