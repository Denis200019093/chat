import React from "react";
import { Grid, TextField, styled } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const SearchRooms: React.FC = () => {
  return (
    <Grid container item>
      <SearchField
        placeholder="Search"
        fullWidth
        InputProps={{
          startAdornment: <SearchIcon sx={{ color: "lightgray", mr: 0.5 }} />,
          style: {
            paddingRight: "4px",
          },
        }}
      />
    </Grid>
  );
};

export default SearchRooms;

const SearchField = styled(TextField)({
  borderRadius: "6px",
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.1)",
  input: { padding: "14px 0", color: "#fff" },
  fieldset: {
    display: "none",
  },
});
