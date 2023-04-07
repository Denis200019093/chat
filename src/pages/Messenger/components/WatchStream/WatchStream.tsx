import React, { useEffect, useCallback, useRef } from "react";
import Stomp from "stompjs";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";

import AddIcCallIcon from "@mui/icons-material/AddIcCall";

import useStompSubscription from "src/hooks/useStompSubscriptions";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { unsetReadyWatch } from "src/redux/slices/streamSlice";
import { handleError } from "src/helpers/handleError";
import {
  useStartWatchMutation,
  useStopWatchingMutation,
} from "src/redux/features/stream.api";

interface IProps {
  clientSocket: Stomp.Client | null;
}

const WatchStream: React.FC<IProps> = ({ clientSocket }) => {
  const { me } = useAppSelector((state) => state.users);
  const { isReadyToWatch, streamerUsername } = useAppSelector(
    (state) => state.stream
  );

  const [watchStream] = useStartWatchMutation();
  const [stopWatching] = useStopWatchingMutation();

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const liveStream = useRef<HTMLVideoElement | null>(null);

  const dispatch = useAppDispatch();

  const { id: roomId } = useParams();

  const handleSocketMessage = useCallback(
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

  useStompSubscription({
    roomId,
    clientSocket,
    handleSocketMessage,
    username: me?.username,
    subscribeOn: "live-stream",
  });

  const startWatchStream = useCallback(async () => {
    try {
      if (!peerConnection.current && isReadyToWatch && streamerUsername) {
        const pc = new RTCPeerConnection();

        await watchStream(streamerUsername)

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
      }
    } catch (error) {
      handleError(error);
    }
  }, [clientSocket, isReadyToWatch, me?.username, roomId, streamerUsername, watchStream]);

  const stopWatchStream = useCallback(async () => {
    try {
      await stopWatching(streamerUsername);
      dispatch(unsetReadyWatch());
    } catch (error) {
      handleError(error)
    }
  }, [dispatch, stopWatching, streamerUsername]);

  useEffect(() => {
    if (isReadyToWatch && streamerUsername) startWatchStream();

    return () => {
      stopWatchStream();
    };
  }, [isReadyToWatch, startWatchStream, stopWatchStream, streamerUsername]);

  return (
    <Grid container>
      <Typography>Live stream</Typography>
      <video
        controls
        style={{ height: "100%", width: "100%" }}
        autoPlay
        ref={liveStream}
      />
      <Grid container item sx={{ mt: 3 }} justifyContent="center">
        <AddIcCallIcon
          onClick={stopWatchStream}
          sx={{
            fontSize: "30px",
            bgcolor: "red",
            borderRadius: "50%",
            p: 1.3,
            color: "#fff",
            cursor: "pointer",
          }}
        />
      </Grid>
    </Grid>
  );
};

export default WatchStream;
