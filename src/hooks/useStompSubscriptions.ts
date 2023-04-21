import { useEffect, useRef, useMemo, useCallback } from "react";
import { StompSubscription } from "@stomp/stompjs";
import Stomp from "stompjs";

type UseStompSubscriptionParams = {
  roomId: string | undefined;
  clientSocket: Stomp.Client | null;
  subscribeOn: "chat" | "my-stream" | "live-stream";
  handleSocketMessage: (message: Stomp.Message) => Promise<void> | void;
  readyToSubscribe?: boolean;
  username?: string;
};

const useStompSubscription = ({
  roomId,
  clientSocket,
  readyToSubscribe = true,
  subscribeOn,
  handleSocketMessage,
  username,
}: UseStompSubscriptionParams) => {
  const subscriptionRef = useRef<StompSubscription | null>(null);

  const myRoomId = Number(roomId);

  const destination = useMemo(() => {
    switch (subscribeOn) {
      case "chat": {
        return `/chatrooms/${myRoomId}`;
      }
      case "my-stream": {
        return `/chatrooms/${myRoomId}/streamer`;
      }
      case "live-stream": {
        return `/chatrooms/${myRoomId}/viewer/${username}`;
      }
    }
  }, [myRoomId, subscribeOn, username]);

  const subscribe = useCallback(() => {
    if (clientSocket?.connected) {
      subscriptionRef.current = clientSocket.subscribe(
        destination,
        handleSocketMessage,
        { id: destination }
      );
    }
  }, [clientSocket, destination, handleSocketMessage]);

  const unsubscribe = useCallback(() => {
    const subscription = subscriptionRef.current;

    if (subscription) {
      subscription.unsubscribe();
      subscriptionRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (clientSocket?.connected && readyToSubscribe) {
      subscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [clientSocket?.connected, readyToSubscribe, subscribe, unsubscribe]);

  return { subscribe, unsubscribe };
};

export default useStompSubscription;
