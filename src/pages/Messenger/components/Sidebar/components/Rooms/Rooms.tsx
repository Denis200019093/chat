import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";

import { useGetRoomsQuery } from "src/redux/features/chatRooms.api";
import { getRoomId } from "src/redux/slices/messagesSlice";
import { useAppDispatch } from "src/hooks/useRedux";

const Rooms: React.FC = () => {
  const { data: rooms } = useGetRoomsQuery();

  const dispatch = useAppDispatch();

  return (
    <>
      {rooms?.map((room) => (
        <Grid
          key={room.id}
          container
          item
          sx={{
            p: 2,
            transition: "0.3s",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.15)",
            },
          }}
          onClick={() => dispatch(getRoomId(room.id))}
          flexWrap="nowrap"
          alignItems="flex-start"
        >
          <Grid item>
            <Avatar
              src="https://cdn.forbes.ru/forbes-static/new/2022/12/avatar-o-639c1ab0b942e.jpg"
              sx={{ mr: 1 }}
            />
          </Grid>
          <Grid item>
            <Grid container item>
              <Typography>{room.name}</Typography>
            </Grid>
            <Grid container item>
              <Typography>{room.description}</Typography>
            </Grid>
          </Grid>
        </Grid>
      ))}
    </>
  );
};

export default Rooms;
