import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { SnackbarParams } from "src/types/root";

interface IState {
  creatingRoom: boolean;
  showRoomProfile: boolean;
  isVideo: boolean;
  snackbarStatus: SnackbarParams;
}

const initialState: IState = {
  creatingRoom: false,
  showRoomProfile: true,
  isVideo: false,
  snackbarStatus: {
    open: false,
    text: "",
    severity: "info",
  },
};

const modesSlice = createSlice({
  name: "modes",
  initialState,
  reducers: {
    showCreateRoomModal(state) {
      state.creatingRoom = true;
    },
    hideCreateRoomModal(state) {
      state.creatingRoom = false;
    },
    showRoomProfile(state) {
      state.showRoomProfile = true;
    },
    hideRoomProfile(state) {
      state.showRoomProfile = false;
    },
    showVideo(state) {
      state.isVideo = true;
    },
    hideVideo(state) {
      state.isVideo = false;
    },
    openSnackbar(state, action: PayloadAction<SnackbarParams>) {
      state.snackbarStatus.open = true;
      state.snackbarStatus.text = action.payload.text;
      state.snackbarStatus.severity = action.payload.severity;
    },
    closeSnackbar(state) {
      state.snackbarStatus.open = false;
      state.snackbarStatus.text = "";
    },
  },
});

export const {
  showCreateRoomModal,
  hideCreateRoomModal,
  showRoomProfile,
  hideRoomProfile,
  openSnackbar,
  closeSnackbar,
  showVideo,
  hideVideo,
} = modesSlice.actions;
export const modesReducer = modesSlice.reducer;
