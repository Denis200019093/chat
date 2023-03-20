import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";

import { useCreateRoomMutation } from "src/redux/features/chatRooms.api";
import { CreateRoomData } from "src/types/root";
import { TransitionProps } from "@mui/material/transitions";
import { hideCreateRoomModal } from "src/redux/slices/modesSlice";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateRoomForm: React.FC<{
  onSubmit: (values: CreateRoomData) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const { handleSubmit, register, reset } = useForm<CreateRoomData>({
    mode: "onChange",
  });

  const submitCreateRoom = async (roomValues: CreateRoomData) => {
    try {
      await onSubmit(roomValues);
      reset();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitCreateRoom)}>
      <Grid container spacing={2}>
        <Grid container item justifyContent="center">
          <Typography variant="h4">Create a new room</Typography>
        </Grid>
        <Grid item>
          <Grid container spacing={2}>
            <Grid container item>
              <TextField
                fullWidth
                {...register("name", { required: true })}
                placeholder="Room name"
              />
            </Grid>
            <Grid container item>
              <TextField
                fullWidth
                {...register("description", { required: true })}
                placeholder="Description"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container item justifyContent="center">
          <Button disabled={isLoading} variant="contained" type="submit">
            Create
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const CreateRoom: React.FC = () => {
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  const { creatingRoom } = useAppSelector((state) => state.modes);

  const dispatch = useAppDispatch();

  const hideDialog = () => dispatch(hideCreateRoomModal());

  if (creatingRoom) {
    return (
      <Dialog
        open={creatingRoom}
        TransitionComponent={Transition}
        keepMounted
        onClose={hideDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <CreateRoomContainer>
          <DialogContent>
            <Grid container item spacing={2}>
              <CreateRoomForm onSubmit={createRoom} isLoading={isLoading} />
            </Grid>
          </DialogContent>
        </CreateRoomContainer>
      </Dialog>
    );
  }

  return (
    <CreateRoomContainer item xs={8} md={4}>
      <CreateRoomForm onSubmit={createRoom} isLoading={isLoading} />
    </CreateRoomContainer>
  );
};

export default CreateRoom;

const CreateRoomContainer = styled(Grid)({
  backgroundColor: "rgb(35,35,35)",
  padding: "24px",
  borderRadius: "6px",
});
