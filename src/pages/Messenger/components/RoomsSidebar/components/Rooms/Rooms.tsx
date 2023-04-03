import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
import { useInView } from "react-intersection-observer";

import Room from "../Room";
import { IRoom } from "src/types/root";
import { useGetRoomsQuery } from "src/redux/features/room.api";
import { useAppDispatch } from "src/hooks/useRedux";

interface IProps {
  searchValue: string;
}

const Rooms: React.FC<IProps> = ({ searchValue }) => {
  const [allRooms, setAllRooms] = useState<IRoom[]>([]);
  const [foundRooms, setFoundRooms] = useState<IRoom[]>([]);
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
  console.log("Rooms");

  useEffect(() => {
    if (rooms && rooms.content.length) {
      if (searchValue && rooms?.totalElements > 15) {
        console.log("First");
        setPageCount(0);
        setAllRooms([]);
        setFoundRooms((prevRooms) => [...prevRooms, ...rooms.content]);
      }

      if (searchValue && rooms.totalElements <= 15) {
        console.log("seco");
        setPageCount(0);
        setAllRooms([]);
        setFoundRooms(rooms.content);
      }

      if (!searchValue && rooms.totalElements > 15) {
        console.log("third");
        setFoundRooms([]);
        setAllRooms((prevRooms) => [...prevRooms, ...rooms.content]);
      }

      if (!searchValue && rooms.totalElements <= 15) {
        console.log("Fifourthrst");
        setFoundRooms([]);
        setAllRooms(rooms.content);
      }
    }
  }, [rooms, searchValue]);

  useEffect(() => {
    if (inView && rooms?.totalElements && rooms?.totalElements > 15)
      setPageCount((prevCount) => prevCount + 1);
  }, [inView, rooms?.totalElements]);

  return (
    <Grid container>
      {isLoading ? (
        <Grid container>
          <CircularProgress />
        </Grid>
      ) : (
        (searchValue ? foundRooms : allRooms).map((room, index) => (
          <Room
            key={room.id}
            room={room}
            ref={ref}
            index={index}
            currentNumberRooms={allRooms.length}
          />
        ))
      )}
      {searchValue && !foundRooms.length && (
        <Typography>Room not found</Typography>
      )}
    </Grid>
  );
};

export default Rooms;
