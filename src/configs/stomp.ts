import Stomp from "stompjs";

export const createStompClient = () => {
  const socketUrl = "ws://localhost:8080/stomp";
  const socket = new WebSocket(socketUrl);
  const stompClient = Stomp.over(socket);
  return stompClient;
};
