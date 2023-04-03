import { useEffect, useRef, useMemo } from "react";
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
        break;
      }
      case "my-stream": {
        return `/chatrooms/${myRoomId}/streamer`;
        break;
      }
      case "live-stream": {
        return `/chatrooms/${myRoomId}/viewer/${username}`;
        break;
      }
    }
  }, [myRoomId, subscribeOn, username]);

  useEffect(() => {
    if (clientSocket?.connected && subscribeOn && readyToSubscribe) {
      subscriptionRef.current = clientSocket.subscribe(
        destination,
        handleSocketMessage,
        { id: destination }
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
    destination,
    handleSocketMessage,
    readyToSubscribe,
    subscribeOn,
  ]);
};

export default useStompSubscription;
