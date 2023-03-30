import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { TransitionGroup } from "react-transition-group";
import {
  Button,
  Collapse,
  Grid,
  IconButton,
  styled,
  keyframes,
} from "@mui/material";

import SouthIcon from "@mui/icons-material/South";

import Message from "./components/Message";
import useScrollBottom from "src/hooks/useScrollBottom";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetMessagesQuery } from "src/redux/features/messages.api";
import { getMessages } from "src/redux/slices/messagesSlice";

interface IProps {
  blockRef: React.MutableRefObject<HTMLDivElement>;
  scrollToBottom: () => void;
}

const Messages: React.FC = () => {
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const { messages } = useAppSelector((state) => state.messages);
  const { roomId } = useAppSelector((state) => state.room);

  const dispatch = useAppDispatch();

  // const blockRef = useScrollBottom([messages]);
  const refToScroll = React.useRef<HTMLDivElement | null>(null);

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
    skip: totalPages === pageCount,
  });

  useEffect(() => {
    if (receivedMessages) {
      dispatch(getMessages(receivedMessages.content));
      setTotalPages(receivedMessages.totalPages);
    }
  }, [dispatch, receivedMessages]);

  useEffect(() => {
    if (inView) {
      setPageCount((prevCount) => prevCount + 1);
    }
  }, [inView]);

  useEffect(() => {
    refToScroll.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <ChatContainer
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
      <Grid ref={refToScroll} container item xs={11}>
        {messages.map((message, index) => (
          <Grid container ref={index === 4 ? ref : null}>
            <Message key={message.id} message={message} />
          </Grid>
        ))}
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
