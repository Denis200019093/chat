import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Typography,
  Drawer,
  CircularProgress,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import ActiveUser from "../ActiveUser";
import MultiLineText from "src/components/MultiLineText";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetRoomInfoQuery } from "src/redux/features/room.api";
import { getActiveUsers } from "src/redux/slices/usersSlice";
import { hideRoomProfile } from "src/redux/slices/modesSlice";

const RoomProfile: React.FC = () => {
  const { activeUsers } = useAppSelector((state) => state.users);
  const { showRoomProfile } = useAppSelector((state) => state.modes);

  const dispatch = useAppDispatch();
  const { id: roomId } = useParams();

  const { isVideo } = useAppSelector((state) => state.modes);

  const { data: roomInfo, isFetching } = useGetRoomInfoQuery(roomId, {
    refetchOnMountOrArgChange: true,
    skip: !roomId,
  });

  useEffect(() => {
    if (roomInfo && roomInfo.activeUsers?.length && roomId)
      dispatch(getActiveUsers(roomInfo.activeUsers));
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
        <Grid container item sx={{ height: "65px" }}>
          <Grid
            container
            item
            alignItems="center"
            justifyContent="space-between"
          >
            <MultiLineText
              text={roomInfo?.name || ""}
              quantityLines={2}
              variant="h2"
            />
            {isVideo ? (
              <IconButton
                onClick={() => dispatch(hideRoomProfile())}
                size="small"
              >
                <CloseIcon sx={{ color: "#fff" }} />
              </IconButton>
            ) : null}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid container item spacing={1}>
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
          <Grid container item spacing={2}>
            <Grid container item alignItems="center">
              <PeopleAltOutlinedIcon
                sx={{ fontSize: "16px", mr: 1, color: "#fff" }}
              />
              <Typography>Members ({activeUsers.length})</Typography>
            </Grid>
            <Grid container item spacing={1}>
              {isFetching ? (
                <CircularProgress />
              ) : (
                activeUsers.map((user) => (
                  <ActiveUser key={user.username} user={user} />
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Drawer>
  );
};

export default RoomProfile;
