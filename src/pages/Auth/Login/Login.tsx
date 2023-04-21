import React, { useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import AuthForm from "../AuthForm";
import { useSignInMutation } from "src/redux/features/auth.api";
import { handleError } from "src/helpers/handleError";
import { getMe } from "src/redux/slices/usersSlice";
import { useAppDispatch } from "src/hooks/useRedux";
import { AuthData } from "src/types/root";

interface IProps {
  signingIn: boolean;
  dataAfterRegister: AuthData;
}

const Login: React.FC<IProps> = ({ signingIn, dataAfterRegister }) => {
  const [signIn, { isLoading }] = useSignInMutation();

  const [cookies, setCookie] = useCookies(["token"]);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const submitLogin = useCallback(
    async (values: AuthData) => {
      try {
        const { token } = await signIn(values).unwrap();
        console.log(token);
        
        if (token) {
          navigate("/");
          dispatch(getMe({ username: values.username }));
          setCookie("token", token, {
            path: "/",
            expires: new Date(Date.now() + 10000000),
          });
        }
      } catch (error) {
        handleError(error);
      }
    },
    [dispatch, navigate, setCookie, signIn]
  );

  return (
    <SignInContainer signingIn={signingIn}>
      <AuthForm
        submitAuthFunc={submitLogin}
        isLoading={isLoading}
        dataAfterRegister={dataAfterRegister}
      />
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
