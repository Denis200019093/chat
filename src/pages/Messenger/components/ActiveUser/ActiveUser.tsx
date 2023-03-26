import React from "react";
import { Grid, Typography, Avatar, Button } from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { IUserRoom } from "src/types/root";
import { setReadyWatch, unsetReadyWatch } from "src/redux/slices/streamSlice";

interface IProps {
  user: IUserRoom;
}

const ActiveUser: React.FC<IProps> = ({ user }) => {
  const { me } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  const youStream = me?.username === user.username;

  const startWatchStream = () => {
    if (youStream) {
      return;
    }

    dispatch(unsetReadyWatch());
    dispatch(setReadyWatch());
  };

  return (
    <Grid container item alignItems="center" justifyContent="space-between">
      <Grid item>
        <Grid container alignItems="center">
          <Avatar sx={{ mr: 1 }} />
          <Typography variant="h6">{user.username}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        {user.userStreaming ? (
          <Button
            sx={{ cursor: youStream ? "not-allowed" : "pointer" }}
            variant="live"
            onClick={startWatchStream}
          >
            {youStream ? "You" : "Live"}
          </Button>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default ActiveUser;