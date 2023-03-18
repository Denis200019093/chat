import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import { StompSubscription } from "@stomp/stompjs";
import Stomp from "stompjs";
import { useAppDispatch } from "./useRedux";

type UseStompSubscriptionParams = {
  roomId: number;
  clientSocket: Stomp.Client | null;
  // readyToSubscribe: boolean;
  subscribeOn: "chat" | "my-stream" | "live-stream";
  username?: string;
  handleSocketMessage: (message: Stomp.Message) => Promise<void> | void;
};

const useStompSubscription = ({
  roomId,
  clientSocket,
  subscribeOn,
  username,
  handleSocketMessage,
}: UseStompSubscriptionParams) => {
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const urlSubscribe = useMemo(() => {
    switch (subscribeOn) {
      case "chat": {
        return `/chatrooms/${roomId}`;
      }
      case "my-stream": {
        return `/chatrooms/${roomId}/streamer`;
      }
      case "live-stream": {
        return `/chatrooms/${roomId}/viewer/${username}`;
      }
      default:
        return "";
    }
  }, [roomId, subscribeOn, username]);

  useEffect(() => {
    if (clientSocket && subscribeOn) {
      subscriptionRef.current = clientSocket.subscribe(
        urlSubscribe,
        handleSocketMessage,
        { id: roomId }
      );
    }

    const handleBeforeUnload = () => subscriptionRef.current?.unsubscribe();

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      const subscription = subscriptionRef.current;

      if (subscription) {
        subscription.unsubscribe();
        console.log("Unsubscribed from subscription");
      }
    };
  }, [clientSocket, handleSocketMessage, roomId, subscribeOn, urlSubscribe]);
};

export default useStompSubscription;
