import Stomp from "stompjs";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  clientSocket: Stomp.Client | null;
  peerConnections: { [username: string]: RTCPeerConnection };
  iWatch: boolean;
}

const initialState: IState = {
  clientSocket: null,
  peerConnections: {},
  iWatch: false,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    setClientSocket(state, action: PayloadAction<Stomp.Client>) {
      state.clientSocket = action.payload;
    },
    setWatch(state) {
      state.iWatch = true;
    },
  },
});

export const { setWatch, setClientSocket } = streamSlice.actions;
export const streamReducer = streamSlice.reducer;
