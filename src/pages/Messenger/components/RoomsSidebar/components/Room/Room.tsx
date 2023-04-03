import React, { memo, forwardRef } from "react";
import { Avatar, Grid, Typography } from "@mui/material";

import MultiLineText from "src/components/MultiLineText";
import { IRoom } from "src/types/root";
import { useAppDispatch } from "src/hooks/useRedux";
import { showRoomProfile } from "src/redux/slices/modesSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  unsetReadyStream,
  unsetReadyWatch,
} from "src/redux/slices/streamSlice";
import { clear, clearPageCount } from "src/redux/slices/messagesSlice";

interface IProps {
  room: IRoom;
  index: number;
  currentNumberRooms: number;
}

const Room = forwardRef<HTMLDivElement, IProps>(
  ({ room, index, currentNumberRooms }, ref) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { pathname } = useLocation();
    const { id: roomId } = useParams();

    const joinRoom = (id: string) => {
      const path = `/chatroom/${id}`;

      if (pathname === path) {
        return;
      }

      dispatch(unsetReadyStream());
      dispatch(unsetReadyWatch());
      dispatch(showRoomProfile());
      navigate(path);
    };

    const bgColor = () => {
      if (roomId && +roomId === +room.id) {
        return "rgba(255,255,255,0.15)";
      } else {
        return "";
      }
    };

    return (
      <Grid
        container
        ref={index === currentNumberRooms - 2 ? ref : null}
        item
        flexWrap="nowrap"
        onClick={() => joinRoom(room.id)}
        sx={{
          p: "16px 8px",
          transition: "0.3s",
          cursor: "pointer",
          bgcolor: bgColor,
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
            <MultiLineText text={room.id + room.name} variant="h6" />
            <Typography>{index}</Typography>
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
  }
);

export default memo(Room);
