import React, { useEffect } from "react";
import { Grid, TextField, styled, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";

import NearMeIcon from "@mui/icons-material/NearMe";
import CheckIcon from "@mui/icons-material/Check";

import {
  useEditMessageMutation,
  useSendMessageMutation,
} from "src/redux/features/messages.api";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";
import { ISendMessageData } from "src/types/root";
import { endEdit } from "src/redux/slices/roomSlice";

const SendMessageBar: React.FC = () => {
  const [sendMessage] = useSendMessageMutation();
  const [editMessage] = useEditMessageMutation();

  const { roomId, editStatus } = useAppSelector((state) => state.messages);

  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ISendMessageData>({
    mode: "onChange",
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (editStatus.messageContent) {
      setValue("content", editStatus.messageContent);
    }
  }, [editStatus.messageContent, setValue]);

  const submitSendMessage = async ({ content }: ISendMessageData) => {
    try {
      if (roomId) {
        if (editStatus.isEditing && editStatus.messageId) {
          editMessage({ content, messageId: editStatus.messageId });
          dispatch(endEdit());
        } else {
          await sendMessage({ content, roomId });
        }

        reset();
      }
    } catch (error) {}
  };

  return (
    <Grid
      container
      item
      sx={{
        position: "absolute",
        bottom: 0,
        pb: 2,
        pt: 2,
      }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={11}>
        <form
          style={{ width: "100%" }}
          onSubmit={handleSubmit(submitSendMessage)}
        >
          <SearchField
            {...register("content", { required: true })}
            fullWidth
            placeholder="Message"
            InputProps={{
              endAdornment: (
                <IconButton type="submit" aria-label="delete" size="small">
                  {editStatus.isEditing ? (
                    <CheckIcon
                      sx={{
                        color: "#000",
                        mr: 0.7,
                        bgcolor: "#efff00",
                        p: 0.65,
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <NearMeIcon
                      sx={{
                        color: "#000",
                        mr: 0.7,
                        bgcolor: "#efff00",
                        p: 0.65,
                        borderRadius: "10px",
                      }}
                    />
                  )}
                </IconButton>
              ),
              style: {
                paddingRight: "4px",
              },
            }}
          />
        </form>
      </Grid>
    </Grid>
  );
};

export default SendMessageBar;

const SearchField = styled(TextField)({
  borderRadius: "15px",
  backgroundColor: "rgba(255,255,255,0.12)",
  // backgroundColor: "#000",
  input: { color: "#fff" },
  fieldset: {
    display: "none",
  },
});
