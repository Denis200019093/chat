import React, { useEffect } from "react";
import { Grid, Typography, Avatar } from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import { useAppDispatch, useAppSelector } from "../../../../hooks/useRedux";
import { useGetRoomInfoQuery } from "../../../../redux/features/chatRooms.api";
import { getActiveUsers } from "../../../../redux/slices/usersSlice";

const RoomProfile: React.FC = () => {
  const { roomId } = useAppSelector((state) => state.messages);
  const { activeUsers } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  const { data: roomInfo } = useGetRoomInfoQuery(roomId, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (roomInfo && roomInfo.users.length && roomId)
      dispatch(getActiveUsers(roomInfo.users));
  }, [dispatch, roomId, roomInfo]);

  return (
    <Grid
      item
      sx={{ pl: 2, pr: 2, bgcolor: "rgb(35,35,35)", height: "100%" }}
    >
      <Grid item>
        <Grid container item sx={{ height: "65px" }} alignItems="center">
          <Typography variant="h4">{roomInfo?.name}</Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          <Grid container item alignItems="center">
            <DescriptionIcon sx={{ fontSize: "16px", mr: 1, color: "#fff" }} />
            <Typography>Description</Typography>
          </Grid>
          <Grid container item>
            <Typography variant="body1">{roomInfo?.description}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          <Grid container item alignItems="center">
            <PeopleAltOutlinedIcon
              sx={{ fontSize: "16px", mr: 1, color: "#fff" }}
            />
            <Typography>Members ({activeUsers.length})</Typography>
          </Grid>
          <Grid container item spacing={1}>
            {activeUsers.map((user) => (
              // {Array.from(new Set(activeUsers)).map((item) => (
              <Grid key={user} container item alignItems="center" mb={1}>
                <Avatar sx={{ mr: 1 }} />
                <Typography variant="h6">{user}</Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default RoomProfile;
