import React, { useEffect } from "react";
import styled from "styled-components";
import { Button, Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import CustomInput from "src/components/CustomInput";
import { handleError } from "src/helpers/handleError";
import { AuthData } from "src/types/root";

interface IProps {
  submitAuthFunc: (values: AuthData) => Promise<void>;
  isLoading: boolean;
  isLogin?: boolean;
  dataAfterRegister?: AuthData;
}

const AuthForm: React.FC<IProps> = ({ submitAuthFunc, isLoading, isLogin = true, dataAfterRegister }) => {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AuthData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: ""
    }
  });

  useEffect(() => {
    if (dataAfterRegister) {
      setValue("username", dataAfterRegister.username);
      setValue("password", dataAfterRegister.password);
    }
  }, [dataAfterRegister, setValue]);

  const submit = async (values: AuthData) => {
    try {
      await submitAuthFunc(values);
      reset();
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <Form onSubmit={handleSubmit(submit)}>
      <Grid container item spacing={2} justifyContent="center">
        <Grid item>
          <Typography variant="h1">{isLogin ? "Login" : "Register"}</Typography>
        </Grid>
        <Grid container item>
          <CustomInput
            {...register("username", {
              required: true,
              minLength: 5,
              maxLength: 15,
            })}
            helperText={errors.username && "Min length 5, max length 15"}
            name="username"
            placeholder="Username"
          />
        </Grid>
        <Grid container item>
          <CustomInput
            {...register("password", {
              required: true,
              minLength: 5,
              maxLength: 15,
            })}
            type="password"
            name="password"
            helperText={errors.password && "Min length 5, max length 15"}
            placeholder="Password"
          />
        </Grid>
        <Grid item>
          <Button disabled={isLoading} variant="contained" type="submit">
            {isLogin ? "Sign In" : "Sign up"}
          </Button>
        </Grid>
      </Grid>
    </Form>
  )
}

export default AuthForm

const Form = styled.form`
  background-color: rgba(35, 35, 35, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;