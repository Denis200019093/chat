import React, { useCallback } from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";
import {
  Outlet,
  useLocation,
  useMatches,
  useOutletContext,
  useParams,
} from "react-router-dom";

import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import RoomProfile from "./RoomProfile";
import SendMessageBar from "./SendMessageBar";
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
  setStreamStatusOfUser,
  deleteStreamStatusOfUser,
  setViewer,
  deleteViewer,
} from "src/redux/slices/usersSlice";

interface MessageHeaders {
  "event-type": string;
}

const Chat: React.FC = () => {
  const [clientSocket] = useOutletContext<any>();

  const { id: roomId } = useParams();
  const { pathname } = useLocation();

  const dispatch = useAppDispatch();

  const isFirstNestedRoute = pathname.includes("stream-manager");
  const isSecondNestedRouteFirst = pathname.includes("watch");

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
          dispatch(setActiveUser(JSON.parse(message.body)));
          break;
        }
        case "unsubscribe-event": {
          dispatch(deleteActiveUser(message.body));
          break;
        }
        case "stream-started-event": {
          dispatch(
            setStreamStatusOfUser({
              id: Date.now(),
              streamer: message.body,
              viewers: [],
            })
          );
          break;
        }
        case "stream-ended-event": {
          dispatch(deleteStreamStatusOfUser(message.body));
          break;
        }
        case "stream-viewer-joined": {
          console.log(JSON.parse(message.body));

          dispatch(setViewer(JSON.parse(message.body)));
          break;
        }
        case "stream-viewer-left": {
          dispatch(deleteViewer(JSON.parse(message.body)));
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
    <Grid container item xs={10}>
      <Outlet context={[clientSocket]} />
      <Grid
        container
        item
        xs={isFirstNestedRoute || isSecondNestedRouteFirst ? 3 : 9}
        sx={{
          position: "relative",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Grid container item sx={{ height: "65px" }}>
          <ChatHeader />
        </Grid>
        <Grid container item xs sx={{ height: "100%" }}>
          <Messages />
        </Grid>
        <Grid container item>
          <SendMessageBar />
        </Grid>
        <RoomProfile />
      </Grid>
    </Grid>
  );
};

export default Chat;
