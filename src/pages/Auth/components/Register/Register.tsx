import React, { useCallback } from "react";
import styled from "styled-components";
import { Button, Typography, Grid } from "@mui/material";

import CustomInput from "src/components/CustomInput";
import { useSignUpMutation } from "src/redux/features/auth.api";
import { handleError } from "src/helpers/handleError";
import { useForm } from "react-hook-form";
import { AuthData } from "src/types/root";

interface IProps {
  signingIn: boolean;
  toggleSignIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const Register: React.FC<IProps> = ({
  signingIn,
  toggleSignIn,
  setUsername,
  setPassword,
}) => {
  const [signUp, { isLoading, isError, error }] = useSignUpMutation();
  console.log(isError, error);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<AuthData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitRegister = useCallback(
    async (values: AuthData) => {
      try {
        await signUp(values).unwrap();

        setUsername(values.username);
        setPassword(values.password);
        toggleSignIn(true);
        reset({
          username: "",
          password: "",
        });
      } catch (error) {
        handleError(error);
      }
    },
    [reset, setPassword, setUsername, signUp, toggleSignIn]
  );

  return (
    <SignUpContainer signingIn={signingIn}>
      <Form onSubmit={handleSubmit(submitRegister)}>
        <Grid container item spacing={2} justifyContent="center">
          <Grid item>
            <Typography variant="h1">Register</Typography>
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
              {...register("password")}
              type="password"
              name="password"
              placeholder="Password"
            />
          </Grid>
          <Grid item>
            <Button disabled={isLoading} variant="contained" type="submit">
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </Form>
    </SignUpContainer>
  );
};

export default Register;

const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.35s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${(props: { signingIn: boolean }) =>
    !props.signingIn
      ? `
      transform: translateX(0);
      opacity: 1;
      z-index: 5;
	  `
      : `
      transform: translateX(100%);
      opacity: 0;
      z-index: 0;
    `}
`;

const Form = styled.form`
  background-color: rgba(35, 35, 35, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;
