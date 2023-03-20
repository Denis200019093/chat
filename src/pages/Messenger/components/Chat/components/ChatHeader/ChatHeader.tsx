import React, { useCallback } from "react";
import { Avatar, Button, Grid } from "@mui/material";

import { offDefaultMode, onDefaultMode } from "src/redux/slices/modesSlice";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useLazyChangeStreamStateQuery } from "src/redux/features/chatRooms.api";
import { setWatch } from "src/redux/slices/streamSlice";

const ChatHeader: React.FC = () => {
  const { roomId } = useAppSelector((state) => state.messages);
  const { iWatch } = useAppSelector((state) => state.stream);

  const [changeStreamState] = useLazyChangeStreamStateQuery();

  const dispatch = useAppDispatch();

  const openVideo = () => dispatch(onDefaultMode());
  const closeVideo = () => dispatch(offDefaultMode());

  const makeCall = async () => {
    try {
      // const stream = await navigator.mediaDevices.getDisplayMedia();
      // dispatch(setStream(stream));
      openVideo();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid
      container
      item
      sx={{
        bgcolor: "rgb(35,35,35)",
      }}
    >
      <Grid
        container
        item
        sx={{ pl: 2 }}
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item>
          <Grid item>
            <Avatar sx={{ width: 30, height: 30 }} />
          </Grid>
        </Grid>
        <Grid item sx={{ mr: 1 }}>
          {/* {streamIsOn ? (
            <Button onClick={closeVideo} variant="contained" color="secondary">
              Stop
            </Button>
          ) : ( */}
          <Button onClick={makeCall} variant="contained" color="secondary">
            Live
          </Button>
          <Button
            onClick={() => {
              dispatch(setWatch());
              // openVideo();
            }}
            variant="contained"
            color="secondary"
          >
            Watch
          </Button>
          {/* )} */}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatHeader;
