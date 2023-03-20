import React from "react";
import { Grid, TextField, styled } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const SearchRooms: React.FC = () => {
  return (
    <SearchField
      placeholder="Search"
      fullWidth
      sx={{ m: "0 8px 20px 8px" }}
      InputProps={{
        startAdornment: <SearchIcon sx={{ color: "lightgray", mr: 0.5 }} />,
        style: {
          paddingRight: "4px",
        },
      }}
    />
  );
};

export default SearchRooms;

const SearchField = styled(TextField)({
  borderRadius: "6px",
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.1)",
  input: { padding: "17px 0", color: "#fff" },
  fieldset: {
    display: "none",
  },
});
