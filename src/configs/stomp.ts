import Stomp from "stompjs";

export const createStompClient = () => {
  const socketUrl = import.meta.env.VITE_WEB_SOCKET_URL;
  const socket = new WebSocket(socketUrl);
  const stompClient = Stomp.over(socket);
  return stompClient;
};
