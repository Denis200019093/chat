import { useEffect, useRef, useMemo, useCallback } from "react";
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

export const useStompSubscription = ({
  roomId,
  clientSocket,
  // readyToSubscribe,
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
    if (
      clientSocket &&
      clientSocket.connected &&
      urlSubscribe.length &&
      subscribeOn
    ) {
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
      subscriptionRef.current?.unsubscribe();
    };
  }, [clientSocket, handleSocketMessage, roomId, subscribeOn, urlSubscribe]);
};

export default useStompSubscription;
