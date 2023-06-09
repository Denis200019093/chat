import React, { memo, forwardRef } from "react";
import { Avatar, Grid } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import MultiLineText from "src/components/MultiLineText";
import { IRoom } from "src/types/root";
import { clear, clearPageCount } from "src/redux/slices/messagesSlice";
import { useAppDispatch } from "src/hooks/useRedux";
import { hideVideo, showRoomProfile } from "src/redux/slices/modesSlice";

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

    const joinRoom = async (id: string) => {
      const path = `/chatroom/${id}`;
      navigate(path);

      if (pathname === path) {
        return;
      }

      dispatch(clear());
      dispatch(clearPageCount());
      dispatch(hideVideo());
      dispatch(showRoomProfile());
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
          bgcolor: roomId && +roomId === +room.id ? "rgba(50,50,50,0.8)" : "",
          "&:hover": {
            bgcolor: "rgba(60,60,60,1)",
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
  }
);

export default memo(Room);
