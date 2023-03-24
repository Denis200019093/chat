import React, { useEffect } from "react";
import Stomp from "stompjs";
import { Grid, Typography, Avatar, Button, Drawer } from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";

import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { useGetRoomInfoQuery } from "src/redux/features/chatRooms.api";
import { getActiveUsers } from "src/redux/slices/usersSlice";
import ActiveUser from "../ActiveUser";

interface IProps {
  clientSocket: Stomp.Client | null;
  setShowRoomProfile: React.Dispatch<React.SetStateAction<boolean>>;
  showRoomProfile: boolean;
}

interface IPropsRoomContainer {
  clientSocket: Stomp.Client | null;
  setShowRoomProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoomContainer: React.FC<IPropsRoomContainer> = ({
  clientSocket,
  setShowRoomProfile,
}) => {
  const { activeUsers } = useAppSelector((state) => state.users);

  const { roomId } = useAppSelector((state) => state.messages);

  const dispatch = useAppDispatch();

  const { data: roomInfo } = useGetRoomInfoQuery(roomId, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (roomInfo && roomInfo.users.length && roomId)
      dispatch(getActiveUsers(roomInfo.users));
  }, [dispatch, roomId, roomInfo]);

  return (
    <Grid item sx={{ pl: 2, pr: 2, bgcolor: "rgb(35,35,35)", height: "100%" }}>
      <Grid item>
        <Grid container item sx={{ height: "65px" }} alignItems="center">
          <Typography variant="h4">{roomInfo?.name}</Typography>
          <Button onClick={() => setShowRoomProfile(false)}>X</Button>
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
              <ActiveUser key={user} user={user} clientSocket={clientSocket} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
const RoomProfile: React.FC<IProps> = ({
  clientSocket,
  showRoomProfile,
  setShowRoomProfile,
}) => {
  const transitionDuration = {
    enter: 500,
    exit: 250,
  };

  if (showRoomProfile) {
    return (
      <Drawer
        anchor="right"
        open={showRoomProfile}
        onClose={() => setShowRoomProfile(false)}
        ModalProps={{
          disableScrollLock: true,
          hideBackdrop: true,
          BackdropProps: {
            transitionDuration,
          },
        }}
        PaperProps={{
          style: {
            position: "absolute",
            transform: "translateX(0)",
            transition: `transform ${transitionDuration.enter}ms cubic-bezier(0, 0, 0.2, 1)`,
          },
        }}
        SlideProps={{
          timeout: transitionDuration,
        }}
      >
        <RoomContainer
          clientSocket={clientSocket}
          setShowRoomProfile={setShowRoomProfile}
        />
      </Drawer>
    );
  }

  return (
    <RoomContainer
      clientSocket={clientSocket}
      setShowRoomProfile={setShowRoomProfile}
    />
  );
};

export default RoomProfile;
