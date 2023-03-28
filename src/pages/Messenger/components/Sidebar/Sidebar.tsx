import React from "react";
import { Grid, styled } from "@mui/material";

import SidebarHeader from "./components/SidebarHeader";
import Rooms from "./components/Rooms";
import CustomInput from "src/components/CustomInput";

const Sidebar: React.FC = () => {
  return (
    <Grid
      container
      item
      sx={{ bgcolor: "rgb(35,35,35)", height: "100%" }}
      justifyContent="center"
    >
      <Grid item xs={11}>
        <SidebarHeader />
        <CustomInput placeholder="Search" fullWidth />
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
  marginTop: "10px",
  height: "calc(100vh - 140px)",
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
