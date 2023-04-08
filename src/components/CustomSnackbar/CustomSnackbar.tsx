import React from "react";
import { Stack, Snackbar } from "@mui/material/";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { closeSnackbar } from "src/redux/slices/modesSlice";
import { useAppDispatch, useAppSelector } from "src/hooks/useRedux";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar: React.FC = () => {
  const { snackbarStatus } = useAppSelector((state) => state.modes);
  const { open, text, severity } = snackbarStatus;

  const dispatch = useAppDispatch();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeSnackbar());
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default CustomSnackbar;
