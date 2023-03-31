import React, { useEffect, useState } from "react";
import Stomp from "stompjs";
import {
  Grid,
  Typography,
  Button,
  Drawer,
  CircularProgress,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import ActiveUser from "../../../ActiveUser";
import MultiLineText from "src/components/MultiLineText";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetRoomInfoQuery } from "src/redux/features/chatRooms.api";
import { getActiveUsers } from "src/redux/slices/usersSlice";
import { hideRoomProfile } from "src/redux/slices/modesSlice";
import { useParams } from "react-router-dom";

const RoomProfile: React.FC = () => {
  const { activeUsers } = useAppSelector((state) => state.users);
  const { showRoomProfile } = useAppSelector((state) => state.modes);

  const dispatch = useAppDispatch();
  const { id: roomId } = useParams();

  const { isReadyToStream, isReadyToWatch } = useAppSelector(
    (state) => state.stream
  );

  const { data: roomInfo, isLoading } = useGetRoomInfoQuery(roomId, {
    refetchOnMountOrArgChange: true,
    skip: !roomId,
  });

  useEffect(() => {
    if (roomInfo && roomInfo.users.length && roomId)
      dispatch(getActiveUsers(roomInfo.users));
  }, [dispatch, roomId, roomInfo]);

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={showRoomProfile}
      onClose={() => dispatch(hideRoomProfile())}
      ModalProps={{
        disableScrollLock: true,
        hideBackdrop: true,
      }}
      PaperProps={{
        style: {
          border: "none",
          width: `calc(100% / ${12} * ${2.5})`,
        },
      }}
    >
      <Grid
        item
        sx={{ pl: 2, pr: 2, bgcolor: "rgb(35,35,35)", height: "100%" }}
      >
        <Grid item>
          <Grid container item alignItems="center">
            <MultiLineText
              text={roomInfo?.name || ""}
              quantityLines={2}
              variant="h2"
            />
            {isReadyToStream || isReadyToWatch ? (
              <Button onClick={() => dispatch(hideRoomProfile())}>X</Button>
            ) : null}
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={1}>
            <Grid container item alignItems="center">
              <DescriptionIcon
                sx={{ fontSize: "16px", mr: 1, color: "#fff" }}
              />
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
                <ActiveUser key={user.username} user={user} />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default RoomProfile;
