import React from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { useCreateRoomMutation } from "src/redux/features/chatRooms.api";
import { CreateRoomData } from "src/types/root";

const CreateRoom: React.FC = () => {
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const { handleSubmit, register, reset } = useForm<CreateRoomData>({
    mode: "onChange",
  });

  const submitCreateRoom = async (roomValues: CreateRoomData) => {
    try {
      await createRoom(roomValues);
      reset();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Grid
      container
      item
      xs={8}
      md={4}
      sx={{ bgcolor: "rgba(250,250,250,0.7)", p: 3, borderRadius: "6px" }}
      justifyContent="center"
    >
      <form onSubmit={handleSubmit(submitCreateRoom)}>
        <Grid container spacing={2}>
          <Grid container item justifyContent="center">
            <Typography variant="h4">Create a new room</Typography>
          </Grid>
          <Grid container item spacing={2}>
            <Grid container item>
              <TextField
                fullWidth
                {...register("name")}
                placeholder="Room name"
              />
            </Grid>
            <Grid container item>
              <TextField
                fullWidth
                {...register("description")}
                placeholder="Description"
              />
            </Grid>
          </Grid>
          <Grid container item justifyContent="center">
            <Button disabled={isLoading} variant="contained" type="submit">
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default CreateRoom;
