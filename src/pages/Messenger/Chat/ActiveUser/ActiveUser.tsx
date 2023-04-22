import React from "react";
import { NavLink } from "react-router-dom";
import { Grid, Typography, Avatar, Button } from "@mui/material";

import { useAppSelector } from "src/hooks/useRedux";
import { IUser } from "src/types/root";

interface IProps {
  user: IUser;
}

const ActiveUser: React.FC<IProps> = ({ user }) => {
  const { me } = useAppSelector((state) => state.users);

  const youStream = me?.username === user.username;

  return (
    <Grid
      container
      item
      sx={{
        pb: 1,
        "&:hover": {
          bgcolor: "rgb(50,50,50)",
        },
      }}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item>
        <Grid container alignItems="center">
          <Avatar sx={{ mr: 1 }} />
          <Typography variant="h6">{user.username}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        {user.stream ? (
          <NavLink to={`watch/${user.username}`}>
            <Button
              sx={{ cursor: youStream ? "not-allowed" : "pointer" }}
              variant="live"
            >
              {youStream ? "You" : "Live"}
            </Button>
          </NavLink>
        ) : null}
      </Grid>
      <Grid container spacing={2} justifyContent="flex-end">
        {user.stream
          ? user.stream.viewers.map((viewer, index) => (
              <Grid key={viewer + index} container item xs={10}>
                <Typography
                  key={viewer}
                  sx={{
                    flexBasis: "100%",
                    bgcolor: "rgb(70,70,70)",
                    borderRadius: "8px",
                    p: 1
                  }}
                >
                  {viewer}
                </Typography>
              </Grid>
            ))
          : null}
      </Grid>
    </Grid>
  );
};

export default ActiveUser;
