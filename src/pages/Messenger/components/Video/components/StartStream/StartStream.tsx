import React, { useState, useEffect, useRef, useCallback } from "react";
import Stomp from "stompjs";
import { Button, Grid, Typography } from "@mui/material";

import useStompSubscription from "src/hooks/useStompSubscriptions";
import { useAppSelector } from "src/hooks/useRedux";

interface IProps {
  clientSocket: Stomp.Client | null;
}

const StartStream: React.FC<IProps> = ({ clientSocket }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  // const [readyToStream, setReadyStream] = useState<boolean>(false);
  const [peerConnections, setPeerConnections] = useState<{
    [username: string]: RTCPeerConnection;
  }>({});

  const yourStream = useRef<HTMLVideoElement>(null);

  const { roomId } = useAppSelector((state) => state.messages);

  const startStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    if (yourStream.current) yourStream.current.srcObject = stream;
    setStream(stream);
  }, []);

  const stopStream = () => {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });
    setStream(null);
  };

  const createConnectionStream = useCallback(
    async (username: string) => {
      if (peerConnections[username]) {
        return;
      }
      // console.log("Create conentcion stream");

      if (clientSocket) {
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
      }
    },
    [clientSocket, peerConnections, roomId, stream]
  );

  const handleSocketMessage = async (message: Stomp.Message) => {
    const data = JSON.parse(message.body);
    console.log("handleSocketMessage streamer", data.event);
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
          await peerConnection.addIceCandidate(new RTCIceCandidate(data.data));

        break;
      }
    }
  };

  useStompSubscription({
    roomId,
    clientSocket,
    handleSocketMessage,
    subscribeOn: "my-stream",
  });

  return (
    <Grid container item justifyContent="center">
      <video
        controls
        hidden={!stream}
        style={{ height: "100%", width: "100%" }}
        autoPlay
        ref={yourStream}
      />
      <Button
        size="large"
        sx={{ mt: 5 }}
        onClick={() => (stream ? stopStream() : startStream())}
        variant="contained"
      >
        {stream ? "Stop" : "Start"} stream
      </Button>
    </Grid>
  );
};

export default StartStream;
