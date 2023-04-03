import React, { useState, useEffect, useRef, useCallback } from "react";
import Stomp from "stompjs";
import { Button, Grid } from "@mui/material";

import useStompSubscription from "src/hooks/useStompSubscriptions";
import { setStreamId, unsetReadyStream } from "src/redux/slices/streamSlice";
import { showRoomProfile } from "src/redux/slices/modesSlice";
import { useAppDispatch } from "src/hooks/useRedux";
import { useParams } from "react-router-dom";
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

  const [endStream] = useLazyEndStreamQuery();
  const [startStream] = useLazyStartStreamQuery();

  const dispatch = useAppDispatch();

  const { id: roomId } = useParams();

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
        dispatch(setStreamId(stream.id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleStopStream = async () => {
      try {
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());

          await endStream();

          setStream(null);
          setStreaming(false);
          dispatch(showRoomProfile());
        }
      } catch (error) {
        console.log(error);
      }
    };

    return () => {
      if (stream) handleStopStream();
    };
  }, [dispatch, endStream, stream]);

  const createConnectionStream = useCallback(
    async (username: string) => {
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

            clientSocket?.send(
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

          clientSocket?.send(
            `/chatrooms/${roomId}/viewer/${username}`,
            {},
            JSON.stringify(messageOffer)
          );
        };

        peerConnection.onconnectionstatechange = () => {
          const connectionState = peerConnection.connectionState;

          if (connectionState === "disconnected") {
            setPeerConnections((prevPeerConnections) => {
              const { [username]: _, ...newState } = prevPeerConnections;
              return Object.fromEntries(Object.entries(newState));
            });
          }
        };

        stream?.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      } catch (error) {
        console.log(error);
      }
    },
    [clientSocket, roomId, stream]
  );

  const handleSocketMessage = useCallback(
    async (message: Stomp.Message) => {
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
            const peerConnection = peerConnections[username];

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
    },
    [createConnectionStream, peerConnections]
  );

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
        variant="contained"
        onClick={() =>
          stream ? dispatch(unsetReadyStream()) : handleStartStream()
        }
      >
        {stream ? "Close/Stop" : "Start"} stream
      </Button>
    </Grid>
  );
};

export default StartStream;
