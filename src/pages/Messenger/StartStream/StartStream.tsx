import React, { useState, useEffect, useRef, useCallback } from "react";
import Stomp from "stompjs";
import { Grid, IconButton } from "@mui/material";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import useStompSubscription from "src/hooks/useStompSubscriptions";
import { handleError } from "src/helpers/handleError";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { hideVideo, showRoomProfile } from "src/redux/slices/modesSlice";
import {
  useStartStreamMutation,
  useStopStreamingMutation,
} from "src/redux/features/stream.api";

const StartStream: React.FC = () => {
  const [clientSocket] = useOutletContext<any>();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setStreaming] = useState<boolean>(false);

  const peerConnectionsRef = useRef<{ [username: string]: RTCPeerConnection }>(
    {}
  );

  const [startStream] = useStartStreamMutation();
  const [stopStreaming] = useStopStreamingMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { me } = useAppSelector((state) => state.users);

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
      handleError(error);
    }
  };

  const handleStopStream = useCallback(async () => {
    try {
      dispatch(hideVideo());
      dispatch(showRoomProfile());

      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());

        await stopStreaming();

        setStream(null);
        setStreaming(false);

        peerConnectionsRef.current = {};
      }
    } catch (error) {
      handleError(error);
    }
  }, [dispatch, stopStreaming, stream]);

  useEffect(() => {
    return () => {
      if (stream) handleStopStream();
    };
  }, [handleStopStream, stream]);

  const createConnectionStream = useCallback(
    async (username: string) => {
      try {
        const peerConnection = new RTCPeerConnection();

        peerConnectionsRef.current = {
          ...peerConnectionsRef.current,
          [username]: peerConnection,
        };

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
            peerConnectionsRef.current = Object.assign(
              {},
              peerConnectionsRef.current,
              {
                [username]: undefined,
              }
            );
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
            const peerConnection = peerConnectionsRef.current[username];

            if (peerConnection)
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(data.data)
              );

            break;
          }

          case "candidate": {
            const username = data.username;
            const peerConnection = peerConnectionsRef.current[username];
            console.log(peerConnectionsRef.current);
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
    [createConnectionStream]
  );

  const stopStreamAndNavigate = () => {
    navigate(`/chatroom/${roomId}`);
    handleStopStream();
  };

  useStompSubscription({
    roomId,
    clientSocket,
    readyToSubscribe: isStreaming,
    handleSocketMessage,
    subscribeOn: "my-stream",
  });

  return (
    <Grid item xs={9}>
      <Grid container item sx={{ height: "65px" }} justifyContent="end">
        <IconButton size="large" onClick={stopStreamAndNavigate}>
          <CloseIcon sx={{ fontSize: "35px", color: "gray" }} />
        </IconButton>
      </Grid>
      <video
        controls
        style={{ maxHeight: "800px", width: "100%" }}
        autoPlay
        ref={currentStream}
      />
      <Grid container justifyContent="center">
        <IconButton
          size="large"
          sx={{ mt: 3 }}
          onClick={() =>
            stream ? stopStreamAndNavigate() : handleStartStream()
          }
        >
          {stream ? (
            <CancelIcon sx={{ fontSize: "50px", color: "red" }} />
          ) : (
            <PlayCircleOutlineIcon
              sx={{ fontSize: "50px", color: "lightgray" }}
            />
          )}
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default StartStream;
