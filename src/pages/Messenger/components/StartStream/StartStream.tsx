import React, { useState, useEffect, useRef, useCallback } from "react";
import Stomp from "stompjs";
import { Button, Grid, IconButton } from "@mui/material";
import { useParams } from "react-router-dom";

import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

import useStompSubscription from "src/hooks/useStompSubscriptions";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { unsetReadyStream } from "src/redux/slices/streamSlice";
import { showRoomProfile } from "src/redux/slices/modesSlice";
import { handleError } from "src/helpers/handleError";
import {
  useStartStreamMutation,
  useStopStreamingMutation,
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

  const [startStream] = useStartStreamMutation();
  const [stopStreaming] = useStopStreamingMutation();

  const dispatch = useAppDispatch();

  const { me } = useAppSelector((state) => state.users)

  const { id: roomId } = useParams();

  const currentStream = useRef<HTMLVideoElement>(null);

  const handleStartStream = async () => {
    try {
      const displayMedia = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      await startStream(roomId);

      if (currentStream.current && displayMedia && me) {
        currentStream.current.srcObject = displayMedia;
        setStream(displayMedia);
        setStreaming(true);
      }
    } catch (error) {
      handleError(error)
    }
  };

  useEffect(() => {
    const handleStopStream = async () => {
      try {
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());

          await stopStreaming();

          setStream(null);
          setStreaming(false);
        }
      } catch (error) {
        handleError(error)
      }
    };

    return () => {
      if (stream) handleStopStream();

      dispatch(showRoomProfile());
    };
  }, [dispatch, stopStreaming, stream]);

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
        handleError(error);
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
        handleError(error);
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
    <Grid container item justifyContent="center">
      <Grid container item sx={{ height: "65px" }} justifyContent="end">
        <IconButton
          size="large"
          onClick={() => dispatch(unsetReadyStream())}
        >
          <CloseIcon sx={{ fontSize: "35px", color: "gray" }} />
        </IconButton>
      </Grid>
      <video
        controls
        style={{ height: "100%", width: "100%" }}
        autoPlay
        ref={currentStream}
      />
      <IconButton
        size="large"
        sx={{ mt: 3 }}
        onClick={() =>
          stream ? dispatch(unsetReadyStream()) : handleStartStream()
        }
      >
        {stream ?
          <CancelIcon sx={{ fontSize: "50px", color: "red" }} /> :
          <PlayCircleOutlineIcon sx={{ fontSize: "50px", color: "lightgray" }}
          />
        }
      </IconButton>
    </Grid>
  );
};

export default StartStream;
