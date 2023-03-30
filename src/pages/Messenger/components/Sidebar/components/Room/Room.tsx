import React from "react";
import { Avatar, Skeleton, Grid } from "@mui/material";

import MultiLineText from "src/components/MultiLineText";
import { IRoom } from "src/types/root";
import { getRoomId } from "src/redux/slices/roomSlice";
import { useAppDispatch } from "src/hooks/useRedux";
import { showRoomProfile } from "src/redux/slices/modesSlice";
import {
  unsetReadyStream,
  unsetReadyWatch,
} from "src/redux/slices/streamSlice";

interface IProps {
  room: IRoom;
}

const Room: React.FC<IProps> = ({ room }) => {
  const dispatch = useAppDispatch();

  const joinRoom = (roomId: number) => {
    dispatch(getRoomId(roomId));
    dispatch(unsetReadyStream());
    dispatch(unsetReadyWatch());
    dispatch(showRoomProfile());
  };

  return (
    <Grid
      container
      item
      flexWrap="nowrap"
      onClick={() => joinRoom(room.id)}
      sx={{
        p: "16px 8px",
        transition: "0.3s",
        cursor: "pointer",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.15)",
        },
      }}
    >
      <Grid item>
        <Avatar
          src="https://cdn.forbes.ru/forbes-static/new/2022/12/avatar-o-639c1ab0b942e.jpg"
          sx={{ mr: 1 }}
        />
      </Grid>
      <Grid item>
        <Grid container item>
          <MultiLineText text={room.name} variant="h6" />
        </Grid>
        <Grid container item>
          <MultiLineText
            text={room.description}
            quantityLines={2}
            variant="body2"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Room;
