import { IUser } from "src/types/root";
import Stomp from "stompjs";

export const handleSocketMessage = async (
  message: Stomp.Message,
  peerConnection: RTCPeerConnection | null,
  clientSocket: Stomp.Client | null,
  me: IUser | null,
  roomId: number | null,
  peerConnections: {
    [username: string]: RTCPeerConnection;
  } | null,
  createConnectionStream?: ((username: string) => Promise<void>) | null
) => {
  const data = JSON.parse(message.body);

  switch (data.event) {
    case "connect": {
      if (createConnectionStream) createConnectionStream(data.username);
      break;
    }
    case "answer": {
      const username = data.username;
      const peerConnection = peerConnections?.[username];

      if (peerConnection) {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(data.data)
        );
      }

      break;
    }

    case "candidate": {
      const username = data.username;
      const peerConnection = peerConnections && peerConnections[username];

      if (peerConnection) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.data));
      }

      break;
    }
    case "offer": {
      await peerConnection?.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(message.body).data)
      );

      if (peerConnection && clientSocket) {
        const answer = await peerConnection.createAnswer();
        await peerConnection?.setLocalDescription(
          new RTCSessionDescription(answer)
        );

        const messageAnswer = {
          event: "answer",
          data: answer,
          username: me?.username,
        };

        clientSocket.send(
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
};
