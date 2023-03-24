import React, { useState, useRef, useEffect } from "react";
import Stomp from "stompjs";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "src/hooks/useRedux";
import useStompSubscription from "src/hooks/useStompSubscriptions";
import withWatchStream from "src/hocs/withWatchStream";

interface IProps {
  clientSocket: Stomp.Client | null;
}

const WatchStream: React.FC<IProps> = ({ clientSocket }) => {
  const [isWatching, setWatching] = React.useState<boolean>(false);
  const [peerConnection, setPeerConnection] =
    React.useState<RTCPeerConnection | null>(null);

  const liveStream = React.useRef<HTMLVideoElement>(null);
  console.log("da");

  const { me } = useAppSelector((state) => state.users);
  const { roomId } = useAppSelector((state) => state.messages);
  const { isReadyToWatch } = useAppSelector((state) => state.stream);

  useEffect(() => {
    const connectToStream = async () => {
      try {
        if (!peerConnection && clientSocket) {
          const pc = new RTCPeerConnection();

          clientSocket.send(
            `/chatrooms/${roomId}/streamer`,
            {},
            JSON.stringify({ username: me?.username, event: "connect" })
          );

          pc.ontrack = (event) => {
            const remoteStream = event.streams[0];

            if (liveStream.current) {
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

          setWatching(true);
          setPeerConnection(pc);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (isReadyToWatch) connectToStream();
  }, [clientSocket, isReadyToWatch, me?.username, peerConnection, roomId]);

  const handleSocketMessage = React.useCallback(
    async (message: Stomp.Message) => {
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
    },
    [clientSocket, me?.username, peerConnection, roomId]
  );

  useStompSubscription({
    roomId,
    clientSocket,
    handleSocketMessage,
    readyToSubscribe: isWatching,
    username: me?.username,
    subscribeOn: "live-stream",
  });

  return (
    <Grid container>
      <Grid>
        {/* <button onClick={() => connectToStream()}>Watch stream</button> */}
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

export default withWatchStream(WatchStream);

// export const Test = withWatchStream(WatchStream);
