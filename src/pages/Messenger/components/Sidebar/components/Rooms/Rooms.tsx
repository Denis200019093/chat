import React from "react";
import { Avatar, Grid } from "@mui/material";

import MultiLineText from "src/components/MultiLineText";
import { useGetRoomsQuery } from "src/redux/features/chatRooms.api";
import { getRoomId } from "src/redux/slices/roomSlice";
import { useAppDispatch } from "src/hooks/useRedux";
import { showRoomProfile } from "src/redux/slices/modesSlice";
import {
  unsetReadyStream,
  unsetReadyWatch,
} from "src/redux/slices/streamSlice";

const Rooms: React.FC = () => {
  const { data: rooms } = useGetRoomsQuery();

  const dispatch = useAppDispatch();

  const joinRoom = (roomId: number) => {
    dispatch(getRoomId(roomId));
    dispatch(unsetReadyStream());
    dispatch(unsetReadyWatch());
    dispatch(showRoomProfile());
  };

  return (
    <>
      {rooms?.map((room) => (
        <Grid
          key={room.id}
          container
          item
          sx={{
            p: "16px 8px",
            transition: "0.3s",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.15)",
            },
          }}
          onClick={() => joinRoom(room.id)}
          flexWrap="nowrap"
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
      ))}
    </>
  );
};

export default Rooms;
