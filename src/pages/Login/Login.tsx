import React, { useCallback } from "react";
import { Grid, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { AuthData } from "src/types/root";
import { useSignInMutation } from "src/redux/features/auth.api";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "src/helpers/handleError";
import { useAppDispatch } from "src/hooks/useRedux";
import { useCookies } from "react-cookie";

const Login: React.FC = () => {
  const [signIn, { isLoading }] = useSignInMutation();

  const [cookies, setCookie] = useCookies(["token"]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthData>({
    mode: "onChange",
  });

  const submitLogin = useCallback(
    async (values: AuthData) => {
      try {
        const { token } = await signIn(values).unwrap();

        if (token) {
          navigate("/");
          setCookie("token", token, {
            path: "/",
            expires: new Date(Date.now() + 10000000),
          });
          localStorage.setItem("token", token);
        }
      } catch (err) {
        if (isFetchBaseQueryError(err)) {
          const errMsg = "error" in err ? err.error : JSON.stringify(err.data);
          console.log(errMsg);
          alert("Somthing went wrong, try again");
        } else if (isErrorWithMessage(err)) {
          console.log(err.message);
        }
      }
    },
    [dispatch, navigate, setCookie, signIn]
  );

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        xs={8}
        md={3}
        sx={{ bgcolor: "lightblue", p: 3, borderRadius: "10px" }}
      >
        <form onSubmit={handleSubmit(submitLogin)}>
          <Grid container spacing={2}>
            <Grid container item justifyContent="center">
              <Typography variant="h4">Login</Typography>
            </Grid>
            <Grid container item>
              <TextField
                fullWidth
                {...register("username")}
                placeholder="Username"
              />
            </Grid>
            <Grid container item>
              <TextField
                fullWidth
                {...register("password")}
                placeholder="Password"
                type="password"
              />
            </Grid>
            <Grid container item justifyContent="center">
              <Button disabled={isLoading} variant="contained" type="submit">
                Sign in
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Login;
