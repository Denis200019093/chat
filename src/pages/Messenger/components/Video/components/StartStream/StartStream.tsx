import React, { useState, useEffect, useRef, useCallback } from "react";
import Stomp from "stompjs";
import { Button, Grid, Typography } from "@mui/material";

import useStompSubscription from "src/hooks/useStompSubscriptions";
import { useAppSelector } from "src/hooks/useRedux";
import {
  useLazyEndStreamQuery,
  useLazyStartStreamQuery,
} from "src/redux/features/stream.api";

interface IProps {
  clientSocket: Stomp.Client | null;
}

const StartStream: React.FC<IProps> = ({ clientSocket }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setStreaming] = useState<boolean>(false);
  const [peerConnections, setPeerConnections] = useState<{
    [username: string]: RTCPeerConnection;
  }>({});

  const [startStream] = useLazyStartStreamQuery();
  const [endStream] = useLazyEndStreamQuery();
  const { roomId } = useAppSelector((state) => state.messages);

  const currentStream = useRef<HTMLVideoElement>(null);

  const handleStartStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      await startStream(roomId);

      if (currentStream.current && stream) {
        currentStream.current.srcObject = stream;
        setStream(stream);
        setStreaming(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopStream = async () => {
    try {
      stream?.getTracks().forEach((track) => {
        track.stop();
      });
      const res = await endStream();
      console.log(res);

      setStream(null);
      setStreaming(false);
    } catch (error) {
      console.log(error);
    }
  };

  const createConnectionStream = useCallback(
    async (username: string) => {
      if (peerConnections[username] || !clientSocket) {
        return;
      }

      try {
        const peerConnection = new RTCPeerConnection();

        setPeerConnections((prevPeerConnections) => ({
          ...prevPeerConnections,
          [username]: peerConnection,
        }));

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            const messageCandidate = {
              event: "candidate",
              data: event.candidate,
            };

            clientSocket.send(
              `/chatrooms/${roomId}/viewer/${username}`,
              {},
              JSON.stringify(messageCandidate)
            );
          }
        };

        peerConnection.onnegotiationneeded = async () => {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          const messageOffer = {
            event: "offer",
            data: offer,
          };

          clientSocket.send(
            `/chatrooms/${roomId}/viewer/${username}`,
            {},
            JSON.stringify(messageOffer)
          );
        };

        peerConnection.onconnectionstatechange = () => {
          const connectionState = peerConnection.connectionState;

          if (connectionState === "disconnected") {
            // setPeerConnections((prev) => {
            //   const { [username]: deletedConnection, ...remainingConnections } = prev;
            //   return { ...prev, peerConnections: remainingConnections };
            // });

            const { username, ...newState } = peerConnections;
            setPeerConnections(newState);

            // setPeerConnections(prevState => {
            //   const {[username]: peerConnection, ...rest} = prevState;
            //   return rest;
            // });

            // setPeerConnections((prev) => delete prev[username]);
          }
        };

        stream?.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      } catch (error) {
        console.log(error);
      }
    },
    [clientSocket, peerConnections, roomId, stream]
  );

  const handleSocketMessage = async (message: Stomp.Message) => {
    try {
      const data = JSON.parse(message.body);

      switch (data.event) {
        case "connect": {
          createConnectionStream(data.username);
          break;
        }
        case "answer": {
          const username = data.username;
          const peerConnection = peerConnections?.[username];

          if (peerConnection)
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.data)
            );

          break;
        }

        case "candidate": {
          const username = data.username;
          const peerConnection = peerConnections && peerConnections[username];

          if (peerConnection)
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(data.data)
            );

          break;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useStompSubscription({
    roomId,
    clientSocket,
    readyToSubscribe: isStreaming,
    handleSocketMessage,
    subscribeOn: "my-stream",
  });

  return (
    <Grid container item sx={{ mt: "65px" }} justifyContent="center">
      <video
        controls
        style={{ height: "100%", width: "100%" }}
        autoPlay
        ref={currentStream}
      />
      <Button
        size="large"
        sx={{ mt: 5 }}
        onClick={() => (stream ? handleStopStream() : handleStartStream())}
        variant="contained"
      >
        {stream ? "Stop" : "Start"} stream
      </Button>
    </Grid>
  );
};

export default StartStream;
