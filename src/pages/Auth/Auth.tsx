import React, { useState } from "react";
import styled from "styled-components";
import { Button, Grid, Typography } from "@mui/material";

import Login from "./components/Login";
import Register from "./components/Register";
import bggif from "../../assets/subtle-prism.svg";

const Auth: React.FC = () => {
  const [signIn, toggleSignIn] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Container>
      <Login signingIn={signIn} username={username} password={password} />
      <Register
        signingIn={signIn}
        toggleSignIn={toggleSignIn}
        setUsername={setUsername}
        setPassword={setPassword}
      />
      <OverlayContainer signingIn={signIn}>
        <Overlay signingIn={signIn}>
          <LeftOverlayPanel signingIn={signIn}>
            <Typography variant="h1">Hello, Friend!</Typography>
            <Typography>Start your chatting now</Typography>
            <Button onClick={() => toggleSignIn(false)} size="large">
              Sign Up
            </Button>
          </LeftOverlayPanel>

          <RightOverlayPanel signingIn={signIn}>
            <Typography variant="h1">Welcome Back!</Typography>
            <Typography>
              Keep chatting in our cool chat after "Sign In"
            </Typography>
            <Button onClick={() => toggleSignIn(true)} size="large">
              Sign In
            </Button>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
};

export default Auth;

export const Container = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 750px;
  max-width: 100%;
  min-height: 400px;
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.35s ease-in-out;
  z-index: 100;
  ${(props: { signingIn: boolean }) =>
    props.signingIn ? `transform: translateX(-100%);` : null}
`;

const Overlay = styled.div`
  background-image: url(${bggif});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.35s ease-in-out;
  ${(props: { signingIn: boolean }) =>
    props.signingIn ? `transform: translateX(50%);` : null}
`;

const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.35s ease-in-out;
`;

const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${(props: { signingIn: boolean }) =>
    props.signingIn ? `transform: translateX(0);` : null}
`;

const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${(props: { signingIn: boolean }) =>
    props.signingIn ? `transform: translateX(20%);` : null}
`;
