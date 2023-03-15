import React from "react";
import { Grid, Typography } from "@mui/material";

import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";

const SidebarHeader: React.FC = () => {
  return (
    <Grid
      container
      item
      sx={{ height: "65px" }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h3">Rooms</Typography>
      <MapsUgcOutlinedIcon sx={{ color: "#fff" }} />
    </Grid>
  );
};

export default SidebarHeader;
