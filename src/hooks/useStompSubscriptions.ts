import { useEffect, useRef, useState } from "react";
import { StompSubscription } from "@stomp/stompjs";
import Stomp from "stompjs";

type UseStompSubscriptionParams = {
  roomId: number;
  clientSocket: Stomp.Client | null;
  readyToSubscribe: boolean;
  subscribeOn: "chat" | "my-stream" | "live-stream";
  handleSocketMessage: (message: Stomp.Message) => Promise<void> | void;
  username?: string;
};

const useStompSubscription = ({
  roomId,
  clientSocket,
  readyToSubscribe,
  subscribeOn,
  handleSocketMessage,
  username,
}: UseStompSubscriptionParams) => {
  const subscriptionRef = useRef<StompSubscription | null>(null);

  let destination = "";

  switch (subscribeOn) {
    case "chat": {
      destination = `/chatrooms/${roomId}`;
      break;
    }
    case "my-stream": {
      destination = `/chatrooms/${roomId}/streamer`;
      break;
    }
    case "live-stream": {
      destination = `/chatrooms/${roomId}/viewer/${username}`;
      break;
    }
    default:
      break;
  }
  console.log(
    clientSocket,
    clientSocket?.connected,
    subscribeOn,
    readyToSubscribe
  );

  useEffect(() => {
    if (
      clientSocket &&
      clientSocket.connected &&
      subscribeOn &&
      readyToSubscribe
    ) {
      subscriptionRef.current = clientSocket.subscribe(
        destination,
        handleSocketMessage,
        {'id' : destination}
      );
    }

    const handleBeforeUnload = () => subscriptionRef.current?.unsubscribe();

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      const subscription = subscriptionRef.current;

      if (subscription) {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        subscription.unsubscribe();
      }
    };
  }, [
    clientSocket,
    handleSocketMessage,
    readyToSubscribe,
    subscribeOn,
    destination,
  ]);
};

export default useStompSubscription;
