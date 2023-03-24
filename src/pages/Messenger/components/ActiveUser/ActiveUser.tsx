import React, { useEffect } from "react";
import { Grid, Typography, Avatar, Button } from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { IRoom, IUserRoom } from "src/types/root";
import withWatchStream from "src/hocs/withWatchStream";
import { setReadyWatch } from "src/redux/slices/streamSlice";

interface IProps {
  user: IUserRoom;
}

const ActiveUser: React.FC<IProps> = ({ user }) => {
  const dispatch = useAppDispatch();

  const startWatchStream = () => dispatch(setReadyWatch());

  return (
    <Grid container item alignItems="center" mb={1}>
      <Avatar sx={{ mr: 1 }} />

      <Typography variant="h6">{user.username}</Typography>
      {user.userStreaming ? (
        <Button onClick={startWatchStream}>Live</Button>
      ) : null}
    </Grid>
  );
};

export default withWatchStream(ActiveUser);
