import React, { useEffect } from "react";
import {
  Button,
  Collapse,
  Grid,
  IconButton,
  styled,
  keyframes,
} from "@mui/material";

import SouthIcon from "@mui/icons-material/South";

import useScrollBottom from "src/hooks/useScrollBottom";
import Message from "./components/Message";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetMessagesQuery } from "src/redux/features/messages.api";
import { clear, getMessages } from "src/redux/slices/messagesSlice";
import { TransitionGroup } from "react-transition-group";

const Messages: React.FC = () => {
  const { messages } = useAppSelector((state) => state.messages);
  const { roomId } = useAppSelector((state) => state.room);

  const dispatch = useAppDispatch();

  const { ref, scrollToBottom } = useScrollBottom();
  const {
    data: receivedMessages = { content: [] },
    isFetching,
    isLoading,
  } = useGetMessagesQuery(roomId, {
    refetchOnMountOrArgChange: true,
    skip: !roomId,
  });
  console.log(isFetching);

  useEffect(() => {
    if (receivedMessages.content && !isFetching) {
      dispatch(getMessages(receivedMessages.content));
    }
  }, [dispatch, isFetching, receivedMessages.content]);

  // useEffect(() => {
  //   if (
  //     receivedMessages.content &&
  //     JSON.stringify(receivedMessages.content) !== JSON.stringify(messages)
  //   ) {
  //     dispatch(getMessages(receivedMessages.content));
  //   }
  // }, [dispatch, messages, receivedMessages.content]);

  return (
    <ChatContainer
      ref={ref}
      container
      item
      sx={{
        height: "100%",
        backgroundImage:
          !messages.length && !isLoading
            ? "url(https://i.gifer.com/origin/3f/3fcf565ccc553afcfd89858c97304705_w200.gif)"
            : null,
        backgroundRepeat: "no-repeat",
        backgroundSize: "20%",
        backgroundPosition: "center",
      }}
      justifyContent="center"
      alignItems="flex-end"
    >
      <Grid container item xs={11}>
        {/* <TransitionGroup> */}
        {messages.map((message) => (
          // <Collapse key={message.id}>
          <Message message={message} />
          // </Collapse>
        ))}
        {/* </TransitionGroup> */}
      </Grid>
      {!messages.length && !isLoading ? (
        <Grid container justifyContent="center">
          <ArrowIcon />
        </Grid>
      ) : null}
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

const ArrowIcon = styled(SouthIcon)(({ theme }) => ({
  fontSize: "40px",
  color: "lightgray",
  animation: `${bounceAnimation} 2s ease infinite`,
}));

const bounceAnimation = keyframes({
  "0%": {
    transform: "translateY(0)",
  },
  "25%": {
    transform: "translateY(-10px)",
  },
  "50%": {
    transform: "translateY(0)",
  },
  "65%": {
    transform: "translateY(-5px)",
  },
  "75%": {
    transform: "translateY(0)",
  },
  "85%": {
    transform: "translateY(-7px)",
  },
  "100%": {
    transform: "translateY(0)",
  },
});

// const bounceAnimation = keyframes({
//   "0%, 100%": {
//     transform: "translateY(0)",
//   },
//   "50%": {
//     transform: "translateY(-10px)",
//   },
// });
