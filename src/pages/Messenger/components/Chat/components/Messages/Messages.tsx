import React, { useEffect } from "react";
import { Button, Grid, styled } from "@mui/material";

import Message from "./components/Message";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetMessagesQuery } from "src/redux/features/messages.api";
import { getMessages } from "src/redux/slices/roomSlice";
import useScrollBottom from "src/hooks/useScrollBottom";

const Messages: React.FC = () => {
  const { messages, roomId } = useAppSelector((state) => state.messages);
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
    <ChatContainer ref={ref} container item justifyContent="center">
      <Grid container item xs={11}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
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
