import React, { useEffect, useState, Suspense, lazy } from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";
import { useCookies } from "react-cookie";

import Sidebar from "./components/Sidebar";
import { createStompClient } from "src/configs/stomp";
import { useAppSelector } from "src/hooks/useRedux";
import { Outlet } from "react-router-dom";
import CreateRoom from "./components/Chat/components/CreateRoom";

const StartStream = lazy(() => import("./components/StartStream"));
const WatchStream = lazy(() => import("./components/WatchStream"));

const Messenger: React.FC = () => {
  const [clientSocket, setClientSocket] = useState<Stomp.Client | null>(null);

  const [cookies] = useCookies(["token"]);
  const { isReadyToWatch, isReadyToStream } = useAppSelector(
    (state) => state.stream
  );

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
      stompClient.disconnect(() => {
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
    <Grid container sx={{ height: "100vh", position: "relative" }}>
      <Grid item xs={2}>
        <Sidebar />
      </Grid>
      <Grid item xs={isReadyToStream || isReadyToWatch ? 7.25 : 0}>
        {isReadyToStream && (
          <Suspense fallback={<div>Loading...</div>}>
            <StartStream clientSocket={clientSocket} />
          </Suspense>
        )}
        {isReadyToWatch && (
          <Suspense fallback={<div>Loading...</div>}>
            <WatchStream clientSocket={clientSocket} />
          </Suspense>
        )}
      </Grid>
      <Grid
        container
        item
        justifyContent="center"
        alignItems="center"
        sx={{ overflow: "hidden" }}
        xs={isReadyToStream || isReadyToWatch ? 2.75 : 7.5}
      >
        <Outlet context={[clientSocket]} />
      </Grid>
      <Grid item xs={5}>
        <CreateRoom />
      </Grid>
    </Grid>
  );
};

export default Messenger;
