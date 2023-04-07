import React from "react";
import { Grid, Typography, Avatar, Button } from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { IUser } from "src/types/root";
import {
  setReadyWatch,
  setStreamerUsername,
} from "src/redux/slices/streamSlice";

interface IProps {
  user: IUser;
}

const ActiveUser: React.FC<IProps> = ({ user }) => {
  const { me } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  const youStream = me?.username === user.username;

  const startWatchStream = () => {
    if (!youStream) {
      dispatch(setStreamerUsername(user.username));
      dispatch(setReadyWatch());
    }
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
        {user.stream ? (
          <Button
            sx={{ cursor: youStream ? "not-allowed" : "pointer" }}
            variant="live"
            onClick={startWatchStream}
          >
            {youStream ? "You" : "Live"}
          </Button>
        ) : null}
      </Grid>
      <Grid container spacing={2}>
        {user.stream ? user.stream.viewers.map((viewer, index) => (
          <Grid key={viewer + index} container item>
            <Typography
              key={viewer}
              sx={{
                width: "100%",
                bgcolor: "purple",
                mb: 1,
                p: 1,
                borderRadius: "8px",
              }}
            >
              {viewer}
            </Typography>
          </Grid>
        )) : null}
      </Grid>
    </Grid>
  );
};

export default ActiveUser;
