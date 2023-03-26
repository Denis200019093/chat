import { createSlice } from "@reduxjs/toolkit";

interface IState {
  creatingRoom: boolean;
  showRoomProfile: boolean;
}

const initialState: IState = {
  creatingRoom: false,
  showRoomProfile: true,
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
  },
});

export const {
  showCreateRoomModal,
  hideCreateRoomModal,
  showRoomProfile,
  hideRoomProfile,
} = modesSlice.actions;
export const modesReducer = modesSlice.reducer;
