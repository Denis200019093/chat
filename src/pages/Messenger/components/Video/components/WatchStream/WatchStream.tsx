import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import Stomp from "stompjs";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "src/hooks/useRedux";
import useStompSubscription from "src/hooks/useStompSubscriptions";

interface MessageHeaders {
  destination: string;
}

const WatchStream: React.FC<{ clientSocket: Stomp.Client | null }> = ({
  clientSocket,
}) => {
  const [readyToWatch, setReadyWatch] = useState<boolean>(false);
  const [peerConnection, setPeerConnection] =
    useState<RTCPeerConnection | null>(null);

  const liveStream = useRef<HTMLVideoElement>(null);

  const { me } = useAppSelector((state) => state.users);
  const { roomId } = useAppSelector((state) => state.messages);

  const handleSocketMessage = async (message: Stomp.Message) => {
    const data = JSON.parse(message.body);

    switch (data.event) {
      case "offer": {
        await peerConnection?.setRemoteDescription(
          new RTCSessionDescription(JSON.parse(message.body).data)
        );

        if (peerConnection) {
          const answer = await peerConnection.createAnswer();
          await peerConnection?.setLocalDescription(
            new RTCSessionDescription(answer)
          );

          const messageAnswer = {
            event: "answer",
            data: answer,
            username: me?.username,
          };

          clientSocket?.send(
            `/chatrooms/${roomId}/streamer`,
            {},
            JSON.stringify(messageAnswer)
          );
        }
        break;
      }
      case "candidate": {
        await peerConnection?.addIceCandidate(
          new RTCIceCandidate(JSON.parse(message.body).data)
        );
        break;
      }
    }
  };

  useStompSubscription({
    roomId,
    clientSocket,
    handleSocketMessage,
    username: me?.username,
    subscribeOn: "live-stream",
  });

  const connectToStream = async () => {
    if (!peerConnection) {
      const pc = new RTCPeerConnection();
      console.log(me?.username);

      clientSocket?.send(
        `/chatrooms/${roomId}/streamer`,
        {},
        JSON.stringify({ username: me?.username, event: "connect" })
      );

      pc.ontrack = (event) => {
        const remoteStream = event.streams[0];
        if (
          liveStream.current &&
          liveStream.current.srcObject !== event.streams[0]
        ) {
          liveStream.current.srcObject = remoteStream;
        }
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const messageCandidate = {
            event: "candidate",
            data: event.candidate,
            username: me?.username,
          };

          clientSocket?.send(
            `/chatrooms/${roomId}/streamer`,
            {},
            JSON.stringify(messageCandidate)
          );
        }
      };

      setReadyWatch(true);
      setPeerConnection(pc);
    }
  };

  return (
    <Grid container>
      <Grid>
        <button onClick={connectToStream}>Watch stream</button>
      </Grid>
      <Grid container item>
        <Typography>Live stream</Typography>
        <video
          controls
          style={{ height: "100%", width: "100%" }}
          autoPlay
          ref={liveStream}
        />
      </Grid>
    </Grid>
  );
};

export default WatchStream;
