import React, { useEffect, useState } from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";
import { useCookies } from "react-cookie";

import RoomsSidebar from "./RoomsSidebar";
import CreateRoom from "./Chat/CreateRoom";
import { Outlet } from "react-router-dom";
import { createStompClient } from "src/configs/stomp";

const Messenger: React.FC = () => {
  const [clientSocket, setClientSocket] = useState<Stomp.Client | null>(null);

  const [cookies] = useCookies(["token"]);

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
      <Grid item sx={{ height: "100%" }} xs={2}>
        <RoomsSidebar />
      </Grid>
      <Outlet context={[clientSocket]} />
      <Grid item xs={10}>
        <CreateRoom />
      </Grid>
    </Grid>
  );
};

export default Messenger;
