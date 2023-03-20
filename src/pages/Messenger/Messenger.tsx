import React, { useEffect, useState, Suspense } from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";
import { useCookies } from "react-cookie";

import { createStompClient } from "src/configs/stomp";
import { useAppSelector } from "src/hooks/useRedux";

import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

import "./test.css";

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

  return (
    <Grid container sx={{ overflow: "hidden", height: "100vh" }}>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid ref={nodeRef} item xs={streamStarted || iWatch ? 7.25 : 0}>
        <Suspense fallback={<div>Loading...</div>}>
          <Video clientSocket={clientSocket} />
        </Suspense>
      </Grid>
      {roomId ? (
        <>
          <Grid
            container
            item
            justifyContent="center"
            alignItems="center"
            sx={{ overflow: "hidden" }}
            xs={streamStarted || iWatch ? 2.75 : 7.5}
          >
            <Chat clientSocket={clientSocket} />
          </Grid>
          {!streamStarted ? (
            <Grid item xs={2.5}>
              <Suspense fallback={<div>Loading...</div>}>
                <RoomProfile />
              </Suspense>
            </Grid>
          ) : null}
        </>
      ) : null}
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
    </Grid>
  );
};

export default Messenger;
