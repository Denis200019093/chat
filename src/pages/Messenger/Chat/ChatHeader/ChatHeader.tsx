import React from "react";
import { Avatar, Button, Grid } from "@mui/material";

import Diversity1Icon from "@mui/icons-material/Diversity1";

import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import {
  hideRoomProfile,
  showRoomProfile,
  showVideo,
} from "src/redux/slices/modesSlice";
import { NavLink } from "react-router-dom";

const ChatHeader: React.FC = () => {
  const { isVideo } = useAppSelector((state) => state.modes);

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
            {isVideo ? (
              <Diversity1Icon
                sx={{ ml: 2, color: "#fff", cursor: "pointer" }}
                onClick={() => dispatch(showRoomProfile())}
              />
            ) : (
              <NavLink to="stream-manager">
                <Button
                  onClick={() => {
                    dispatch(hideRoomProfile());
                    dispatch(showVideo());
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Live
                </Button>
              </NavLink>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatHeader;
