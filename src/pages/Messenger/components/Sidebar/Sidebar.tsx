import React from "react";
import { Grid, styled } from "@mui/material";

import SearchRooms from "./components/SearchRooms";
import SidebarHeader from "./components/SidebarHeader";
import Rooms from "./components/Rooms";

const Sidebar: React.FC = () => {
  return (
    <Grid container item sx={{ bgcolor: "rgb(35,35,35)" }}>
      <Grid container item>
        <SidebarHeader />
      </Grid>
      <Grid container item>
        <SearchRooms />
      </Grid>
      <RoomsContainer item>
        <Rooms />
      </RoomsContainer>
    </Grid>
  );
};

export default Sidebar;

const RoomsContainer = styled(Grid)({
  overflowY: "auto",
  height: "calc(100vh - 145px)",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "rgb(30,30,30)",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgb(50,50,50)",
  },
});
