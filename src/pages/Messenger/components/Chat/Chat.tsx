import React, { useCallback, useEffect, useRef } from "react";
import Stomp from "stompjs";
import { StompSubscription } from "@stomp/stompjs";
import { Grid } from "@mui/material";

import ChatHeader from "./components/ChatHeader";
import SendMessageBar from "./components/SendMessageBar";
import Messages from "./components/Messages";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import {
  localAddMessage,
  localDeleteMessage,
  localEditMessage,
} from "src/redux/slices/roomSlice";
import {
  localDeleteActiveUser,
  localSetActiveUser,
} from "src/redux/slices/usersSlice";
import useStompSubscription from "src/hooks/useStompSubscriptions";

interface MessageHeaders {
  "event-type": string;
}

const Chat: React.FC<{ clientSocket: Stomp.Client | null }> = ({
  clientSocket,
}) => {
  const { roomId } = useAppSelector((state) => state.messages);
  const dispatch = useAppDispatch();

  const handleSocketMessage = useCallback(
    (message: Stomp.Message) => {
      const headers = message.headers as MessageHeaders;

      switch (headers["event-type"]) {
        case "chat-message": {
          dispatch(localAddMessage(JSON.parse(message.body)));
          break;
        }
        case "chat-message-delete": {
          dispatch(localDeleteMessage(JSON.parse(message.body).id));
          break;
        }
        case "chat-message-edit": {
          dispatch(
            localEditMessage({
              content: JSON.parse(message.body).content,
              messageId: JSON.parse(message.body).id,
            })
          );
          break;
        }
        case "subscribe-event": {
          dispatch(localSetActiveUser(message.body));
          break;
        }
        case "unsubscribe-event": {
          dispatch(localDeleteActiveUser(message.body));
          break;
        }
      }
    },
    [dispatch]
  );

  useStompSubscription({
    roomId,
    clientSocket,
    readyToSubscribe: true,
    handleSocketMessage,
    subscribeOn: "chat",
  });

  return (
    <Grid
      container
      item
      direction="column"
      sx={{
        position: "relative",
        height: "100%",
      }}
    >
      <Grid container item sx={{ flexShrink: 0, height: "65px" }}>
        <ChatHeader />
      </Grid>
      <Grid item xs sx={{ overflowY: "auto" }}>
        <Messages />
      </Grid>
      <Grid item sx={{ flexShrink: 0 }}>
        <SendMessageBar />
      </Grid>
    </Grid>
  );
};

export default Chat;
