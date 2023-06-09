import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Grid, styled } from "@mui/material";

import Rooms from "./Rooms";
import SidebarHeader from "./SidebarHeader";
import CustomInput from "src/components/CustomInput";
import useDebounce from "src/hooks/useDebounce";

const RoomsSidebar: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<{ name: string }>({
    mode: "onSubmit",
  });

  const searchValue = watch("name");
  const debouncedValue = useDebounce(searchValue);

  return (
    <Grid
      container
      item
      sx={{ bgcolor: "rgb(35,35,35)", height: "100%" }}
      justifyContent="center"
    >
      <Grid item xs={11}>
        <SidebarHeader />
        <CustomInput
          {...register("name")}
          defaultValue=""
          name="name"
          placeholder="Room name..."
        />
      </Grid>
      <RoomsContainer item>
        <Rooms searchValue={debouncedValue} />
      </RoomsContainer>
    </Grid>
  );
};

export default RoomsSidebar;

const RoomsContainer = styled(Grid)({
  overflowY: "auto",
  marginTop: "10px",
  width: "100%",
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
