import React, { useCallback } from "react";
import { Grid, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { AuthData } from "src/types/root";
import { useSignUpMutation } from "src/redux/features/auth.api";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [signUp, { isLoading }] = useSignUpMutation();

  const navigate = useNavigate();

  const { handleSubmit, register } = useForm<AuthData>({
    mode: "onChange",
  });

  const submitRegister = useCallback(
    async (values: AuthData) => {
      try {
        await signUp(values);
        navigate("/login");
      } catch (e) {
        console.log(e);
      }
    },
    [navigate, signUp]
  );

  return (
    <Grid container justifyContent="center">
      <Grid
        item
        xs={8}
        md={3}
        sx={{ bgcolor: "lightblue", p: 3, borderRadius: "10px" }}
      >
        <form onSubmit={handleSubmit(submitRegister)}>
          <Grid container spacing={2}>
            <Grid container item justifyContent="center">
              <Typography variant="h4">Register</Typography>
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
                Sign up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
};

export default Register;
