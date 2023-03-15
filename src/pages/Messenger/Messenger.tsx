import React, { useEffect, useState, Suspense, useRef } from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";
import { CSSTransition } from "react-transition-group";
import { useCookies } from "react-cookie";

import { createStompClient } from "src/configs/stomp";
import { useAppSelector } from "src/hooks/useRedux";

import Sidebar from "./components/Sidebar";

import "./test.css";

const Chat = React.lazy(() => import("./components/Chat"));
const Video = React.lazy(() => import("./components/Video"));
const RoomProfile = React.lazy(() => import("./components/RoomProfile"));
const CreateRoom = React.lazy(
  () => import("./components/Chat/components/CreateRoom")
);

const Messenger: React.FC = () => {
  const [clientSocket, setClientSocket] = useState<Stomp.Client | null>(null);

  const nodeRef = React.useRef<HTMLDivElement>(null);

  const [cookies] = useCookies(["token"]);

  const { roomId } = useAppSelector((state) => state.messages);
  const { streamStarted } = useAppSelector((state) => state.modes);
  const { iWatch } = useAppSelector((state) => state.stream);

  useEffect(() => {
    const stompClient = createStompClient();

    if (cookies.token)
      stompClient.connect(
        {
          "X-Authorization": `Bearer ${cookies.token}`,
        },
        () => {
          console.log("Connected to socket!");
        }
      );

    setClientSocket(stompClient);

    const handleBeforeUnload = () =>
      stompClient?.disconnect(() => {
        console.log("Disconnected from socket!");
      });

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      stompClient.disconnect(() => {
        console.log("Disconnected from socket!");
      });
    };
  }, [cookies.token]);

  const [width, setWidth] = useState<boolean>(false);

  return (
    <Grid container sx={{ overflow: "hidden", height: "100vh" }}>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <CSSTransition
        nodeRef={nodeRef}
        in={streamStarted || iWatch}
        timeout={300}
        unmountOnExit
        classNames="alert"
        onEntered={() => setWidth(true)}
        onExited={() => setWidth(false)}
      >
        <Grid ref={nodeRef} item xs={7.25}>
          <Suspense fallback={<div>Loading...</div>}>
            <Video clientSocket={clientSocket} />
          </Suspense>
        </Grid>
      </CSSTransition>
      {roomId ? (
        <>
          <Grid
            container
            item
            justifyContent="center"
            alignItems="center"
            sx={{ overflow: "hidden" }}
            xs={streamStarted || width ? 2.75 : 7.5}
          >
            <Suspense fallback={<div>Loading...</div>}>
              <Chat clientSocket={clientSocket} />
            </Suspense>
          </Grid>
          {!streamStarted || !width ? (
            <Grid item xs={2.5}>
              <Suspense fallback={<div>Loading...</div>}>
                <RoomProfile />
              </Suspense>
            </Grid>
          ) : null}
        </>
      ) : (
        <Grid item xs={9.75}>
          <Grid
            container
            item
            sx={{ height: "100%" }}
            justifyContent="center"
            alignItems="center"
          >
            <Suspense fallback={<div>Loading...</div>}>
              <CreateRoom />
            </Suspense>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default Messenger;
