import React from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Slide,
  styled,
  Typography,
} from "@mui/material";

import CustomInput from "src/components/CustomInput";
import { CreateRoomData } from "src/types/root";
import { TransitionProps } from "@mui/material/transitions";
import { hideCreateRoomModal } from "src/redux/slices/modesSlice";
import { useCreateRoomMutation } from "src/redux/features/room.api";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { handleError } from "src/helpers/handleError";

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
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateRoomData>({
    mode: "onChange",
  });
  console.log(errors);

  const submitCreateRoom = async (roomValues: CreateRoomData) => {
    try {
      await onSubmit(roomValues);
      reset();
    } catch (error) {
      handleError(error);
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
              <CustomInput
                fullWidth
                {...register("name", {
                  required: "Field is required",
                })}
                placeholder="Title"
                helperText={errors && errors.name ? errors.name.message : ""}
              />
            </Grid>
            <Grid container item>
              <CustomInput
                fullWidth
                {...register("description", {
                  required: "Field is required",
                })}
                placeholder="Description"
                helperText={
                  errors && errors.description ? errors.description.message : ""
                }
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

  const { id: roomId } = useParams();
  const dispatch = useAppDispatch();

  const hideDialog = () => dispatch(hideCreateRoomModal());

  if (creatingRoom || roomId) {
    return (
      <Dialog
        open={creatingRoom}
        TransitionComponent={Transition}
        keepMounted
        onClose={hideDialog}
      >
        <CreateRoomContainer>
          <DialogContent>
            <Grid container justifyContent="center">
              <CreateRoomForm onSubmit={createRoom} isLoading={isLoading} />
            </Grid>
          </DialogContent>
        </CreateRoomContainer>
      </Dialog>
    );
  }

  return (
    <CreateRoomContainer item>
      <CreateRoomForm onSubmit={createRoom} isLoading={isLoading} />
    </CreateRoomContainer>
  );
};

export default CreateRoom;

const CreateRoomContainer = styled(Grid)({
  backgroundColor: "rgb(35,35,35)",
  padding: "24px",
});
