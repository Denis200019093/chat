import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  // stream: MediaStream | null;
  peerConnections: { [username: string]: RTCPeerConnection };
  iWatch: boolean;
}

const initialState: IState = {
  // stream: null,
  peerConnections: {},
  iWatch: false,
};

const streamSlice = createSlice({
  name: "stream",
  initialState,
  reducers: {
    // setStream(state, action: PayloadAction<MediaStream>) {
    //   state.stream = action.payload;
    // },
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

export const { setWatch } = streamSlice.actions;
export const streamReducer = streamSlice.reducer;
