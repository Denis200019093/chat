import React, { useState, useEffect } from "react";
import { Grid, CircularProgress } from "@mui/material";
import { useInView } from "react-intersection-observer";

import Room from "../Room";
import { IRoom } from "src/types/root";
import { useGetRoomsQuery } from "src/redux/features/chatRooms.api";
import { useNavigate } from "react-router-dom";

const Rooms: React.FC = () => {
  const [allRooms, setAllRooms] = useState<IRoom[]>([]);
  const [totalRooms, setTotalRooms] = useState<number | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  console.log("Ky");

  const { data: rooms, isFetching } = useGetRoomsQuery(pageCount, {
    refetchOnMountOrArgChange: true,
    // skip: allRooms.length === totalRooms,
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    skip: allRooms.length === totalRooms,
  });

  useEffect(() => {
    if (rooms) {
      setAllRooms((prevRooms) => [...prevRooms, ...rooms.content]);
      setTotalRooms(rooms.totalElements);
    }
  }, [rooms]);

  useEffect(() => {
    if (inView) {
      setPageCount((prevCount) => prevCount + 1);
    }
  }, [inView]);

  return (
    <Grid container>
      {allRooms.map((room, index) => (
        <Grid key={room.id} container ref={index === 0 ? ref : null}>
          <Room room={room} />
        </Grid>
      ))}
      {isFetching && (
        <Grid container>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

export default Rooms;
