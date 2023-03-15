import React from "react";
import { Grid, styled } from "@mui/material";

import SearchRooms from "./components/SearchRooms";
import SidebarHeader from "./components/SidebarHeader";
import Rooms from "./components/Rooms";

const Sidebar: React.FC = () => {
  return (
    <Grid item sx={{ height: "100vh", bgcolor: "rgba(35,35,35,0.1)" }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid container item xs={11}>
          <SidebarHeader />
        </Grid>
        <Grid item xs={11} sx={{ mb: 2 }}>
          <SearchRooms />
        </Grid>
        <RoomsContainer item>
          <Rooms />
        </RoomsContainer>
      </Grid>
    </Grid>
  );
};

export default Sidebar;

const RoomsContainer = styled(Grid)({
  overflowY: "auto",
  height: "calc(100vh - 150px)",
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
