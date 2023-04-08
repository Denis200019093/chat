import React, { forwardRef } from "react";
import { RefCallBack } from "react-hook-form";
import TextField, { BaseTextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material";

interface IProps extends BaseTextFieldProps {
  suggestions?: boolean; // Default browser autocomplete
}

const CustomInput = forwardRef<RefCallBack, IProps>(
  ({ suggestions = false, ...props }, ref) => {
    return (
      <Input
        inputRef={ref}
        sx={{}}
        inputProps={{
          autoComplete: suggestions ? "" : "new-password",
          form: {
            autoComplete: suggestions ? "on" : "off",
          },
        }}
        fullWidth
        {...props}
      />
    );
  }
);

export default CustomInput;

const Input = styled(TextField)({
  borderRadius: "6px",
  backgroundColor: "rgba(50,50,50,0.5)",
  input: { color: "#fff" },
  fieldset: {
    display: "none",
  },
});
