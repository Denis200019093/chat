import React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";

interface IProps extends TypographyProps {
  text: string;
  quantityLines?: number;
}

const MultiLineText: React.FC<IProps> = ({
  text,
  quantityLines = 1,
  ...props
}) => {
  return (
    <Typography
      sx={{
        display: "-webkit-box",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: quantityLines,
      }}
      {...props}
    >
      {text}
    </Typography>
  );
};

export default MultiLineText;
