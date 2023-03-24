import React, { useEffect, useState, Suspense } from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";
import { useCookies } from "react-cookie";

import { createStompClient } from "src/configs/stomp";
import { useAppSelector } from "src/hooks/useRedux";

import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";
// import WatchStream from "./components/Video/components/WatchStream";

import "./test.css";
// import { Test } from "./components/Video/components/WatchStream/WatchStream";

const Video = React.lazy(() => import("./components/Video"));
const StartStream = React.lazy(
  () => import("./components/Video/components/StartStream")
);
const WatchStream = React.lazy(
  () => import("./components/Video/components/WatchStream")
);
const RoomProfile = React.lazy(() => import("./components/RoomProfile"));
const CreateRoom = React.lazy(
  () => import("./components/Chat/components/CreateRoom")
);

const Messenger: React.FC = () => {
  const [showRoomProfile, setShowRoomProfile] = useState<boolean>(false);
  const [clientSocket, setClientSocket] = useState<Stomp.Client | null>(null);

  const [cookies] = useCookies(["token"]);
  const { roomId } = useAppSelector((state) => state.messages);
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
      <Grid container item xs={2}>
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
      {roomId ? (
        <>
          <Grid
            container
            item
            justifyContent="center"
            alignItems="center"
            sx={{ overflow: "hidden" }}
            xs={isReadyToStream || isReadyToWatch ? 2.75 : 7.5}
          >
            <Chat
              clientSocket={clientSocket}
              setShowRoomProfile={setShowRoomProfile}
            />
          </Grid>
          <Grid item xs={2.5}>
            <Suspense fallback={<div>Loading...</div>}>
              <RoomProfile
                clientSocket={clientSocket}
                showRoomProfile={showRoomProfile}
                setShowRoomProfile={setShowRoomProfile}
              />
            </Suspense>
          </Grid>
        </>
      ) : null}
      {/* <Grid item xs={9.75}>
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
      </Grid> */}
    </Grid>
  );
};

export default Messenger;
