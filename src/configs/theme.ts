import { createTheme, responsiveFontSizes } from "@mui/material";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    live: true;
  }
}

export let theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "live" },
          style: {
            backgroundColor: "red",
            color: "#fff",
            fontWeight: 500,
            borderRadius: "20px",
            padding: "0px 13px",
            "&:hover": {
              backgroundColor: "red",
            },
          },
        },
        // {
        //   props: { variant: "live", disabled: true },
        //   style: {
        //     // backgroundColor: "red",
        //     pointerEvents: "all",
        //     color: "lightgray",
        //     cursor: "not-allowed",
        //   },
        // },
      ],
    },
  },
});

theme = responsiveFontSizes(theme);

theme.typography.h1 = {
  color: "#fff",
};
theme.typography.h2 = {
  color: "#fff",
};
theme.typography.h3 = {
  color: "#fff",
};
theme.typography.h4 = {
  color: "#fff",
};
theme.typography.h5 = {
  color: "#05264e",
};
theme.typography.h6 = {
  color: "#fff",
};
theme.typography.body1 = {
  color: "lightgray",
};
theme.typography.body2 = {
  color: "lightgray",
};
