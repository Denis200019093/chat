import React from "react";
import { Grid, Typography } from "@mui/material";

import MapsUgcOutlinedIcon from "@mui/icons-material/MapsUgcOutlined";
import { useAppDispatch } from "src/hooks/useRedux";
import { showCreateRoomModal } from "src/redux/slices/modesSlice";

const SidebarHeader: React.FC = () => {
  const dispatch = useAppDispatch();

  const showDialog = () => dispatch(showCreateRoomModal());

  return (
    <Grid
      container
      item
      sx={{ p: "14px 8px" }}
      justifyContent="space-between"
      alignItems="center"
    >
      <Typography variant="h3">Rooms</Typography>
      <MapsUgcOutlinedIcon
        onClick={showDialog}
        sx={{
          color: "#fff",
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": { color: "green" },
        }}
      />
    </Grid>
  );
};

export default SidebarHeader;
