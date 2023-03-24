import React from "react";
import Stomp from "stompjs";
import { useAppSelector } from "src/hooks/useRedux";

const withWatchStream = (WrappedComponent: React.ComponentType<any>) => {
  return (props: any) => {
    const [readyToWatch, setReadyWatch] = React.useState<boolean>(false);
    const [peerConnection, setPeerConnection] =
      React.useState<RTCPeerConnection | null>(null);

    const liveStream = React.useRef<HTMLVideoElement>(null);

    const { me } = useAppSelector((state) => state.users);
    const { roomId } = useAppSelector((state) => state.messages);

    const connectToStream = async (clientSocket: Stomp.Client | null) => {
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

        setReadyWatch(true);
        setPeerConnection(pc);
      }
    };

    return (
      <WrappedComponent
        readyToWatch={readyToWatch}
        setReadyWatch={setReadyWatch}
        peerConnection={peerConnection}
        setPeerConnection={setPeerConnection}
        connectToStream={connectToStream}
        liveStream={liveStream}
        {...props}
      />
    );
  };
};

export default withWatchStream;
// const withWatchStream = (Component: React.ComponentType<any>) => () => {
//   const [readyToWatch, setReadyWatch] = React.useState<boolean>(false);
//   const [peerConnection, setPeerConnection] =
//     React.useState<RTCPeerConnection | null>(null);

//   const liveStream = React.useRef<HTMLVideoElement>(null);

//   const { me } = useAppSelector((state) => state.users);
//   const { roomId } = useAppSelector((state) => state.messages);

//   const connectToStream = async (clientSocket: Stomp.Client | null) => {
//     if (!peerConnection && clientSocket) {
//       const pc = new RTCPeerConnection();

//       clientSocket.send(
//         `/chatrooms/${roomId}/streamer`,
//         {},
//         JSON.stringify({ username: me?.username, event: "connect" })
//       );

//       pc.ontrack = (event) => {
//         const remoteStream = event.streams[0];

//         if (liveStream.current) {
//           liveStream.current.srcObject = remoteStream;
//         }
//       };

//       pc.onicecandidate = (event) => {
//         if (event.candidate) {
//           const messageCandidate = {
//             event: "candidate",
//             data: event.candidate,
//             username: me?.username,
//           };

//           clientSocket?.send(
//             `/chatrooms/${roomId}/streamer`,
//             {},
//             JSON.stringify(messageCandidate)
//           );
//         }
//       };

//       setReadyWatch(true);
//       setPeerConnection(pc);
//     }
//   };

//   return (props: any) => (
//     <Component connectToStream={connectToStream} {...props} />
//   );
// };

// export default withWatchStream;
