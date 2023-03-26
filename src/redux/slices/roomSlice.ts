import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  roomId: number;
}

const initialState: IState = {
  roomId: 0,
};

const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    getRoomId(state, action: PayloadAction<number>) {
      state.roomId = action.payload;
    },
  },
});

export const { getRoomId } = roomSlice.actions;
export const roomReducer = roomSlice.reducer;
