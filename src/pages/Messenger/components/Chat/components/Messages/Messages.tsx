import React from "react";
import { Grid, styled } from "@mui/material";

import Message from "./components/Message";
import { useAppSelector } from "src/hooks/useRedux";

interface IProps {
  refer: React.MutableRefObject<HTMLDivElement>;
}

const Messages: React.FC<IProps> = ({ refer }) => {
  const { messages } = useAppSelector((state) => state.messages);

  return (
    <ChatContainer
      container
      item
      sx={{ bgcolor: "rgba(25,25,25,1)" }}
      justifyContent="center"
    >
      <Grid container item xs={11}>
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </Grid>
      <Grid ref={refer} />
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
