import React, { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useParams } from "react-router-dom";
import { Grid, styled, keyframes } from "@mui/material";

import SouthIcon from "@mui/icons-material/South";

import Message from "./components/Message";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetMessagesQuery } from "src/redux/features/messages.api";
import { clear, getMessages, nextPage } from "src/redux/slices/messagesSlice";

const Messages: React.FC = () => {
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const { messages, pageCount } = useAppSelector((state) => state.messages);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const refToScroll = useRef<HTMLDivElement | null>(null);

  const dispatch = useAppDispatch();
  const { id: roomId } = useParams();

  const {
    data: receivedMessages,
    isFetching,
    isLoading,
  } = useGetMessagesQuery(
    { roomId, pageCount },
    {
      refetchOnMountOrArgChange: true,
      skip: !roomId,
    }
  );

  const { ref, inView } = useInView({
    threshold: 1,
    skip: messages.totalPages === pageCount,
  });

  useEffect(() => {
    if (receivedMessages?.content.length && !isFetching) {
      dispatch(getMessages({ ...receivedMessages, currentRoomId: roomId }));
    }

    return () => {
      if (messages.currentRoomId !== roomId) dispatch(clear());
    };
  }, [dispatch, isFetching, messages.currentRoomId, receivedMessages, roomId]);

  useEffect(() => {
    if (inView) {
      dispatch(nextPage());
    }
  }, [dispatch, inView]);

  const handleScroll = React.useCallback(() => {
    if (
      chatBottomRef.current &&
      chatBottomRef.current.scrollHeight -
        (chatBottomRef.current.scrollTop + chatBottomRef.current.clientHeight) >
        150
    ) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, []);

  useEffect(() => {
    chatBottomRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      chatBottomRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (!showScrollButton && chatBottomRef.current)
      chatBottomRef.current.scrollTop = chatBottomRef.current.scrollHeight;
  }, [showScrollButton, messages]);

  return (
    <ChatContainer
      container
      ref={chatBottomRef}
      item
      sx={{
        height: "100%",
        backgroundImage:
          !receivedMessages?.content.length &&
          !messages.content.length &&
          !isLoading
            ? "url(https://i.gifer.com/origin/3f/3fcf565ccc553afcfd89858c97304705_w200.gif)"
            : null,
        backgroundRepeat: "no-repeat",
        backgroundSize: "20%",
        backgroundPosition: "center",
      }}
      justifyContent="center"
      alignItems="flex-end"
    >
      <Grid ref={refToScroll} container item xs={11}>
        {messages.content.length &&
          !isLoading &&
          !isFetching &&
          messages.content.map((message, index) => (
            <Message
              key={message.id}
              index={index}
              ref={ref}
              message={message}
            />
          ))}
      </Grid>
      {!receivedMessages?.content.length &&
        !messages.content.length &&
        !isLoading && (
          <Grid container justifyContent="center">
            <ArrowIcon />
          </Grid>
        )}
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
