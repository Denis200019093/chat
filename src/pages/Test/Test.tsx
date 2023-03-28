import React from "react";
import styled from "styled-components";

import bggif from "../../assets/subtle-prism.svg";
// import bggif from "../../assets/EIg.gif";

import "./test.css";

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

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.35s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${(props: { signingIn: boolean }) =>
    props.signingIn !== true
      ? `
  transform: translateX(100%);
	opacity: 1;
	z-index: 5;
	`
      : null}
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.35s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${(props: { signingIn: boolean }) =>
    props.signingIn !== true ? `transform: translateX(100%);` : null}
`;

export const Form = styled.form`
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

export const Title = styled.h1`
  font-weight: bold;
  margin: 0;
`;

export const Input = styled.input`
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
`;

export const Button = styled.button`
  border-radius: 20px;
  border: 1px solid #ff4b2b;
  background-color: #ff4b2b;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
  &:active {
    transform: scale(0.95);
  }
  &:focus {
    outline: none;
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border-color: #ffffff;
`;

export const Anchor = styled.a`
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.35s ease-in-out;
  z-index: 100;
  ${(props: { signingIn: boolean }) =>
    props.signingIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
  // background: #ff416c;
  // background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
  // background: linear-gradient(to right, #ff4b2b, #ff416c);
  background-image: url(${bggif});
  // animation: animate 5s infinite;
  // background-image: url(https://media.tenor.com/O2RBK9klEMYAAAAM/homer-simpson-homer.gif);
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
  // @keyframes animate {
  //   0% {
  //     background-position: 0px 0px;
  //   }
  //   100% {
  //     background-position: 0px -500px;
  //   }
  // }
  ${(props: { signingIn: boolean }) =>
    props.signingIn !== true ? `transform: translateX(50%);` : null}
`;

export const OverlayPanel = styled.div`
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

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${(props: { signingIn: boolean }) =>
    props.signingIn !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${(props: { signingIn: boolean }) =>
    props.signingIn !== true ? `transform: translateX(20%);` : null}
`;
export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
`;

const Test = () => {
  const [signIn, toggle] = React.useState(false);

  return (
    <Container>
      <SignUpContainer signingIn={signIn}>
        <Form>
          <Title>Create Account</Title>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Sign Up</Button>
        </Form>
      </SignUpContainer>
      <SignInContainer signingIn={signIn}>
        <Form>
          <Title>Sign in</Title>
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Sign In</Button>
        </Form>
      </SignInContainer>
      <OverlayContainer signingIn={signIn}>
        <Overlay signingIn={signIn}>
          <LeftOverlayPanel signingIn={signIn}>
            <Title>Welcome Back!</Title>
            <Paragraph>
              Keep chatting in our cool chat after "Sign In"
            </Paragraph>
            <GhostButton onClick={() => toggle(true)}>Sign In</GhostButton>
          </LeftOverlayPanel>
          <RightOverlayPanel signingIn={signIn}>
            <Title>Hello, Friend!</Title>
            <Paragraph>Start your chatting now</Paragraph>
            <GhostButton onClick={() => toggle(false)}>Sign Up</GhostButton>
          </RightOverlayPanel>
        </Overlay>
      </OverlayContainer>
    </Container>
  );
};

export default Test;

// const show = keyframes`
//   0%, 49.99% {
// 		opacity: 0;
// 		z-index: 1;
// 	}

// 	50%, 100% {
// 		opacity: 1;
// 		z-index: 5;
// 	}
// `;

// const hide = keyframes`
//   0%, 49.99% {
//     opacity: 1;
//     z-index: 5;
//   }

//   50%, 100% {
//     opacity: 0;
//     z-index: 1;
//   }
// `
