import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";

import Room from "../Room";
import { IRoom } from "src/types/root";
import { useGetRoomsQuery } from "src/redux/features/room.api";
import { useAppDispatch } from "src/hooks/useRedux";
import { useParams } from "react-router-dom";

interface IProps {
  searchValue: string;
}

const Rooms: React.FC<IProps> = ({ searchValue }) => {
  const [allRooms, setAllRooms] = useState<IRoom[]>([]);
  const [block, setBlock] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);

  const dispatch = useAppDispatch();

  const {
    data: rooms,
    isLoading,
    isFetching,
    currentData,
  } = useGetRoomsQuery(
    { pageCount, searchValue },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { ref, inView } = useInView({
    threshold: 0.1,
    skip: rooms?.last,
  });

  useEffect(() => {
    if (searchValue) {
      setPageCount(0);
      setAllRooms([]);
      setBlock(true);
    }
  }, [searchValue]);

  useEffect(() => {
    if (rooms && rooms.content.length) {
      setAllRooms((prevRooms) => [...prevRooms, ...rooms.content]);
    }
  }, [rooms, searchValue]);

  // useEffect(() => {
  //   if (rooms && rooms.content.length) {
  //     setAllRooms((prevRooms) => {
  //       const newRooms = rooms.content.filter((room) => {
  //         return !prevRooms.some((prevRoom) => prevRoom.id === room.id);
  //       });
  //       return [...prevRooms, ...newRooms];
  //     });
  //   }
  // }, [rooms, searchValue]);

  useEffect(() => {
    if (inView && rooms?.totalElements && rooms?.totalElements > 15)
      setPageCount((prevCount) => prevCount + 1);
  }, [inView, rooms?.totalElements]);
  const { id: roomId } = useParams();
  return (
    <Grid container>
      {isLoading ? (
        <Grid container>
          <CircularProgress />
        </Grid>
      ) : (
        allRooms.map((room, index) => (
          <Room
            key={room.id}
            room={room}
            ref={ref}
            index={index}
            currentNumberRooms={allRooms.length}
          />
        ))
      )}
      {searchValue && !allRooms.length && (
        <Typography>Room not found</Typography>
      )}
    </Grid>
  );
};

export default Rooms;
