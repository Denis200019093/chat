import React, { useEffect } from "react";
import { Button, Collapse, Grid, styled } from "@mui/material";

import useScrollBottom from "src/hooks/useScrollBottom";
import Message from "./components/Message";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetMessagesQuery } from "src/redux/features/messages.api";
import { getMessages } from "src/redux/slices/messagesSlice";
import { TransitionGroup } from "react-transition-group";

const Messages: React.FC = () => {
  const { messages } = useAppSelector((state) => state.messages);
  const { roomId } = useAppSelector((state) => state.room);

  const { ref, scrollToBottom } = useScrollBottom();
  const { data: receivedMessages = { content: [] } } = useGetMessagesQuery(
    roomId,
    {
      refetchOnMountOrArgChange: true,
      skip: !roomId,
    }
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (receivedMessages && receivedMessages.content.length) {
      dispatch(getMessages(receivedMessages.content));
    }
  }, [dispatch, receivedMessages, receivedMessages.content]);

  return (
    <ChatContainer ref={ref} container item sx={{ height: "100%" }} justifyContent="center" alignItems="flex-end">
      <Grid container item  xs={11}>
        <TransitionGroup style={{ width: "100%" }}>
          {messages.map((message) => (
            <Collapse key={message.id}>
              <Message message={message} />
            </Collapse>
          ))}
        </TransitionGroup>
      </Grid>
    </ChatContainer>
  );
};

export default Messages;

const ChatContainer = styled(Grid)({
  paddingTop: "15px",
  overflow: "auto",
  maxHeight: "calc(100vh - 150px)",
  paddingBottom: "16px",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "rgb(30,30,30)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgb(50,50,50)",
  },
});
