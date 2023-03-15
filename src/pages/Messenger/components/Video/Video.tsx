import React from "react";
import Stomp from "stompjs";
import { Grid } from "@mui/material";

import StartStream from "./components/StartStream";
import WatchStream from "./components/WatchStream";
import { useAppSelector } from "src/hooks/useRedux";

const Video: React.FC<{ clientSocket: Stomp.Client | null }> = ({
  clientSocket,
}) => {
  const { streamStarted } = useAppSelector((state) => state.modes);
  const { iWatch } = useAppSelector((state) => state.stream);

  return (
    <Grid container spacing={2}>
      {streamStarted ? (
        <Grid item xs={12}>
          <StartStream clientSocket={clientSocket} />
        </Grid>
      ) : null}
      {iWatch && (
        <Grid item xs={12}>
          <WatchStream clientSocket={clientSocket} />
        </Grid>
      )}
    </Grid>
  );
};

export default Video;
