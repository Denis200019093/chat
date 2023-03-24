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
        inputProps={{
          // startAdornment: <SearchIcon sx={{ color: "lightgray", mr: 0.5 }} />,
          // style: {
          //   paddingRight: "4px",
          // },
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
  backgroundColor: "rgba(255,255,255,0.1)",
  input: { color: "#fff" },
  fieldset: {
    display: "none",
  },
});
