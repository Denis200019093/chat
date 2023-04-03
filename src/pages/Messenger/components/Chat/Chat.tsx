import React, { useCallback } from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";
import { useOutletContext, useParams } from "react-router-dom";

import Messages from "./components/Messages";
import ChatHeader from "./components/ChatHeader";
import RoomProfile from "./components/RoomProfile";
import SendMessageBar from "./components/SendMessageBar";
import useStompSubscription from "src/hooks/useStompSubscriptions";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import {
  addMessage,
  deleteMessage,
  editMessage,
} from "src/redux/slices/messagesSlice";
import {
  deleteActiveUser,
  setActiveUser,
  setUserStreamingFalse,
  setUserStreamingTrue,
} from "src/redux/slices/usersSlice";

interface MessageHeaders {
  "event-type": string;
}

const Chat: React.FC = () => {
  const [clientSocket] = useOutletContext<any>();

  const { isReadyToWatch, isReadyToStream } = useAppSelector(
    (state) => state.stream
  );

  const dispatch = useAppDispatch();

  const { id: roomId } = useParams();

  const handleSocketMessage = useCallback(
    (message: Stomp.Message) => {
      const headers = message.headers as MessageHeaders;

      switch (headers["event-type"]) {
        case "chat-message": {
          dispatch(addMessage(JSON.parse(message.body)));
          break;
        }
        case "chat-message-delete": {
          dispatch(deleteMessage(JSON.parse(message.body).id));
          break;
        }
        case "chat-message-edit": {
          dispatch(
            editMessage({
              content: JSON.parse(message.body).content,
              messageId: JSON.parse(message.body).id,
            })
          );
          break;
        }
        case "subscribe-event": {
          dispatch(
            setActiveUser({ username: message.body, userStreaming: false })
          );
          break;
        }
        case "unsubscribe-event": {
          dispatch(deleteActiveUser(message.body));
          break;
        }
        case "stream-started-event": {
          dispatch(setUserStreamingTrue(message.body));
          break;
        }
        case "stream-ended-event": {
          dispatch(setUserStreamingFalse(message.body));
          break;
        }
      }
    },
    [dispatch]
  );

  useStompSubscription({
    roomId,
    clientSocket,
    handleSocketMessage,
    readyToSubscribe: clientSocket?.connected,
    subscribeOn: "chat",
  });

  return (
    <Grid
      container
      item
      direction="column"
      justifyContent="center"
      alignItems="center"
      xs={isReadyToStream || isReadyToWatch ? 2.75 : 7.5}
      sx={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Grid container item sx={{ height: "65px" }}>
        <ChatHeader />
      </Grid>
      <Grid container item xs>
        <Messages />
      </Grid>
      <Grid container item>
        <SendMessageBar />
      </Grid>
      <RoomProfile />
    </Grid>
  );
};

export default Chat;
