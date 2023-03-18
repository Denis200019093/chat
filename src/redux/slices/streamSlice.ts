import Stomp from "stompjs";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  // stream: MediaStream | null;
  clientSocket: Stomp.Client | null;
  peerConnections: { [username: string]: RTCPeerConnection };
  iWatch: boolean;
}

const initialState: IState = {
  // stream: null,
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
    // setPeerConnection(
    //   state,
    //   action: PayloadAction<{
    //     username: string;
    //     peerConnection: RTCPeerConnection;
    //   }>
    // ) {
    //   const { username, peerConnection } = action.payload;
    //   state.peerConnections[username] = peerConnection;
    // },
    // removePeerConnection(state, action: PayloadAction<string>) {
    //   const username = action.payload;
    //   delete state.peerConnections[username];
    // },
    setWatch(state) {
      state.iWatch = true;
    },
  },
});

export const { setWatch, setClientSocket } = streamSlice.actions;
export const streamReducer = streamSlice.reducer;
