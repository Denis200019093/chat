import React from "react";
import { Avatar, Button, Grid } from "@mui/material";

import Diversity1Icon from "@mui/icons-material/Diversity1";

import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { setReadyStream } from "src/redux/slices/streamSlice";

interface IProps {
  setShowRoomProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader: React.FC<IProps> = ({ setShowRoomProfile }) => {
  const { isReadyToStream, isReadyToWatch } = useAppSelector(
    (state) => state.stream
  );

  const dispatch = useAppDispatch();

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
          <Avatar sx={{ width: 30, height: 30 }} />
        </Grid>
        <Grid item sx={{ mr: 1 }}>
          <Grid container alignItems="center">
            <Button
              onClick={() => dispatch(setReadyStream())}
              variant="contained"
              color="secondary"
            >
              Live
            </Button>

            {isReadyToStream || isReadyToWatch ? (
              <Diversity1Icon
                sx={{ ml: 2 }}
                onClick={() => setShowRoomProfile(true)}
              />
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatHeader;
