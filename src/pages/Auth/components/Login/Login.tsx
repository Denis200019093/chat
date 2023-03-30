import React, { useCallback, useEffect } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import styled from "styled-components";

import CustomInput from "src/components/CustomInput";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useSignInMutation } from "src/redux/features/auth.api";
import { AuthData } from "src/types/root";
import { useForm } from "react-hook-form";
import {
  isErrorWithMessage,
  isFetchBaseQueryError,
} from "src/helpers/handleError";
import { getMe } from "src/redux/slices/usersSlice";
import { useAppDispatch } from "src/hooks/useRedux";

interface IProps {
  signingIn: boolean;
  username: string;
  password: string;
}

const Login: React.FC<IProps> = ({ signingIn, username, password }) => {
  const [signIn, { isLoading }] = useSignInMutation();
  console.log(username);

  const [cookies, setCookie] = useCookies(["token"]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<AuthData>({
    mode: "onChange",
  });

  useEffect(() => {
    if (username && password) {
      setValue("username", username);
      setValue("password", password);
    }
  }, [password, setValue, username]);

  const submitLogin = useCallback(
    async (values: AuthData) => {
      try {
        const { token } = await signIn(values).unwrap();

        if (token) {
          navigate("/");
          dispatch(getMe({ username: values.username, userStreaming: false }));
          setCookie("token", token, {
            path: "/",
            expires: new Date(Date.now() + 10000000),
          });
        }
      } catch (err) {
        console.log(err);

        // if (isFetchBaseQueryError(err)) {
        //   const errMsg = "error" in err ? err.error : JSON.stringify(err.data);
        //   console.log(errMsg);
        //   alert("Somthing went wrong, try again");
        // } else if (isErrorWithMessage(err)) {
        //   console.log(err.message);
        // }
      }
    },
    [dispatch, navigate, setCookie, signIn]
  );

  return (
    <SignInContainer signingIn={signingIn}>
      <Form onSubmit={handleSubmit(submitLogin)}>
        <Grid container item spacing={2} justifyContent="center">
          <Grid item>
            <Typography variant="h1">Login</Typography>
          </Grid>
          <Grid container item>
            <CustomInput
              {...register("username", { required: true })}
              defaultValue={""}
              name="username"
              placeholder="Username"
            />
          </Grid>
          <Grid container item>
            <CustomInput
              {...register("password", { required: true })}
              type="password"
              name="password"
              placeholder="Password"
              defaultValue={""}
            />
          </Grid>
          <Grid item>
            <Button disabled={isLoading} variant="contained" type="submit">
              Sign In
            </Button>
          </Grid>
        </Grid>
      </Form>
    </SignInContainer>
  );
};

export default Login;

const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.35s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${(props: { signingIn: boolean }) =>
    props.signingIn
      ? `transform: translateX(100%);`
      : `transform: translateX(0); opacity: 0;`}
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
