import React, { useEffect } from "react";
import Stomp from "stompjs";
import { Button, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import useStompSubscription from "src/hooks/useStompSubscriptions";
import { unsetReadyWatch } from "src/redux/slices/streamSlice";

interface IProps {
  clientSocket: Stomp.Client | null;
}

const WatchStream: React.FC<IProps> = ({ clientSocket }) => {
  const { me } = useAppSelector((state) => state.users);
  const { roomId } = useAppSelector((state) => state.room);
  const { isReadyToWatch } = useAppSelector((state) => state.stream);

  const peerConnection = React.useRef<RTCPeerConnection | null>(null);
  const liveStream = React.useRef<HTMLVideoElement | null>(null);

  const dispatch = useAppDispatch();

  const handleSocketMessage = React.useCallback(
    async (message: Stomp.Message) => {
      const data = JSON.parse(message.body);

      switch (data.event) {
        case "offer": {
          if (
            peerConnection.current &&
            peerConnection.current.signalingState === "stable"
          ) {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(JSON.parse(message.body).data)
            );

            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(
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
          if (
            peerConnection.current &&
            peerConnection.current.remoteDescription
          ) {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(JSON.parse(message.body).data)
            );
          }
          break;
        }
      }
    },
    [clientSocket, me?.username, roomId]
  );

  const { subscriptionActive } = useStompSubscription({
    roomId,
    clientSocket,
    handleSocketMessage,
    username: me?.username,
    subscribeOn: "live-stream",
  });

  useEffect(() => {
    const connectToStream = () => {
      try {
        if (!peerConnection.current) {
          const pc = new RTCPeerConnection();

          clientSocket?.send(
            `/chatrooms/${roomId}/streamer`,
            {},
            JSON.stringify({ username: me?.username, event: "connect" })
          );

          pc.ontrack = (event) => {
            const remoteStream = event.streams[0];

            if (liveStream.current && remoteStream) {
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

          peerConnection.current = pc;

          // setPeerConnection(pc);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (isReadyToWatch) connectToStream();
  }, [clientSocket, isReadyToWatch, me?.username, roomId]);

  return (
    <Grid container>
      <Typography>Live stream</Typography>
      <video
        controls
        style={{ height: "100%", width: "100%" }}
        autoPlay
        ref={liveStream}
      />
      <Button onClick={() => dispatch(unsetReadyWatch())}>Close stream</Button>
    </Grid>
  );
};

export default WatchStream;
