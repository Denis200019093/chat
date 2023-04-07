import React, { useCallback } from "react";
import styled from "styled-components";

import AuthForm from "../AuthForm";
import { useSignUpMutation } from "src/redux/features/auth.api";
import { openSnackbar } from "src/redux/slices/modesSlice";
import { handleError } from "src/helpers/handleError";
import { useAppDispatch } from "src/hooks/useRedux";
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
  const [signUp, { isLoading }] = useSignUpMutation();

  const dispatch = useAppDispatch();

  const submitRegister = useCallback(
    async (values: AuthData) => {
      try {
        await signUp(values).unwrap();

        setUsername(values.username);
        setPassword(values.password);
        toggleSignIn(true);
        dispatch(openSnackbar({
          text: "Registration is successful. Click 'Sign in' to submit",
          severity: "info"
        }))
      } catch (error) {
        handleError(error);
      }
    },
    [dispatch, setPassword, setUsername, signUp, toggleSignIn]
  );

  return (
    <SignUpContainer signingIn={signingIn}>
      <AuthForm submitAuthFunc={submitRegister} isLoading={isLoading} isLogin={false} />
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
