import { useEffect, useRef, useMemo, useCallback } from "react";
// import { StompSubscription } from "@stomp/stompjs";
// import Stomp from "stompjs";
// import { useAppDispatch } from "./useRedux";
// import useStompSubscription from "./useStompSubscriptions";

// // type UseStompSubscriptionParams = {};

// export const useHandleSocketMessages = ({}: any) => {
//   const handleSocketMessage = async (message: Stomp.Message) => {
//     const data = JSON.parse(message.body);

//     switch (data.event) {
//       case "connect": {
//         createConnectionStream(data.username);
//         break;
//       }
//       case "answer": {
//         const username = data.username;
//         const peerConnection = peerConnections?.[username];

//         if (peerConnection) {
//           await peerConnection.setRemoteDescription(
//             new RTCSessionDescription(data.data)
//           );
//         }

//         break;
//       }

//       case "candidate": {
//         const username = data.username;
//         const peerConnection = peerConnections && peerConnections[username];

//         if (peerConnection) {
//           await peerConnection.addIceCandidate(new RTCIceCandidate(data.data));
//         }

//         break;
//       }
//       case "offer": {
//         await peerConnection?.setRemoteDescription(
//           new RTCSessionDescription(JSON.parse(message.body).data)
//         );

//         if (peerConnection) {
//           const answer = await peerConnection.createAnswer();
//           await peerConnection?.setLocalDescription(
//             new RTCSessionDescription(answer)
//           );

//           const messageAnswer = {
//             event: "answer",
//             data: answer,
//             username: me?.username,
//           };

//           clientSocket?.send(
//             `/chatrooms/${roomId}/streamer`,
//             {},
//             JSON.stringify(messageAnswer)
//           );
//         }
//         break;
//       }
//       case "candidate": {
//         await peerConnection?.addIceCandidate(
//           new RTCIceCandidate(JSON.parse(message.body).data)
//         );
//         break;
//       }
//     }
//   };

// };

// export default useHandleSocketMessages;
