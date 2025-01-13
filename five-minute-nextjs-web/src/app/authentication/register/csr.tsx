"use client";
// @mui material components
import Card from "@mui/material/Card";

// Material Kit 2 PRO React components
import MKBox from "@/MKcomponents/MKBox";
import Box from "@mui/material/Box";
import MKTypography from "@/MKcomponents/MKTypography";
import TextField from "@mui/material/TextField";

//Input Managers
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import FormSubmit from "../components/formSubmit";
import { useActionState, useEffect } from "react";
import ActionMessageDisplay from "../components/ActionMessageDisplay";
import {
  emailVerificationServerAction,
  codeVerificationServerAction,
  signUpServerAction,
} from "./formAction";
import Link from "next/link";

//다중 기능 추가
import { useState } from "react";

enum Mode {
  EmailVerification,
  CodeVerification,
  SignUp,
}

export default function SignUpPostForm() {
  const color = "success";
  const [mode, setMode] = useState<Mode>(Mode.EmailVerification); // 1: 이메일 인증, 2: 인증 코드 입력, 3: 회원가입
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const [emailVerificationActionData, emailVerificationFormAction] =
    useActionState(emailVerificationServerAction, {
      email: "",
      message: "",
      verificationCode: "",
      isValid: false,
    });

  const [codeVerificationActionData, codeVerificationFormAction] =
    useActionState(codeVerificationServerAction, {
      message: "",
      isVerified: false,
    });

  const [signupActionData, signupFormAction] = useActionState(
    signUpServerAction,
    {
      message: "",
    }
  );

  useEffect(() => {
    if (emailVerificationActionData) {
      if (emailVerificationActionData.verificationCode)
        setVerificationCode(emailVerificationActionData.verificationCode);

      if (emailVerificationActionData.email)
        setEmail(emailVerificationActionData.email);

      if (emailVerificationActionData.message)
        setMessage(emailVerificationActionData.message);

      if (emailVerificationActionData.isValid)
        setMode(Mode.CodeVerification);
    }
  }, [emailVerificationActionData]);

  useEffect(() => {
    if (codeVerificationActionData) {
      if (codeVerificationActionData.message)
        setMessage(codeVerificationActionData.message);
      if (codeVerificationActionData.isVerified) 
        setMode(Mode.SignUp);
    }
  }, [codeVerificationActionData]);

  useEffect(() => {
    if (signupActionData && signupActionData.message) {
      setMessage(signupActionData.message);
    }
  }, [signupActionData]);

  return (
    <Card>
      <MKBox
        variant="gradient"
        bgColor={color}
        borderRadius="lg"
        coloredShadow={color}
        mx={2}
        mt={-3}
        p={3}
        mb={1}
        textAlign="center"
      >
        <MKTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          {mode === Mode.EmailVerification && "이메일을 인증하세요"}
          {mode === Mode.CodeVerification && "인증 코드를 입력하세요"}
          {mode === Mode.SignUp && "지금 가입하세요"}
        </MKTypography>
        <MKTypography display="block" variant="button" color="white" my={1}>
          {mode === Mode.EmailVerification &&
            "Enter your email to receive a verification code"}
          {mode === Mode.CodeVerification &&
            "Enter the verification code sent to your email"}
          {mode === Mode.SignUp && "Enter your email and password to register"}
        </MKTypography>
        <MKTypography display="block" variant="button" mt={2}>
          {message && <ActionMessageDisplay message={message} />}
        </MKTypography>
      </MKBox>
      <Box p={3}>
        {mode === Mode.EmailVerification && (
          <form action={emailVerificationFormAction}>
            <Box mb={2}>
              <EmailInput />
            </Box>
            <MKBox mt={3} mb={1}>
              <FormSubmit
                pendingText="sending verification code..."
                buttonText="Send Code"
                color={color}
              />
            </MKBox>
          </form>
        )}

        {mode === Mode.CodeVerification && (
          <form action={codeVerificationFormAction}>
            <Box mb={2}>
              <input
                type="hidden"
                name="verificationCode"
                value={verificationCode}
              />
              <TextField
                type="number"
                name="inputCode"
                label="Verification Code"
                fullWidth
                required
              />
            </Box>
            <MKBox mt={3} mb={1}>
              <FormSubmit
                pendingText="Verifying..."
                buttonText="Verify"
                color={color}
              />
            </MKBox>
          </form>
        )}

        {mode === Mode.SignUp && (
          <form action={signupFormAction}>
            <Box mb={2}>
              <TextField
                type="email"
                name="email"
                fullWidth
                label="Email"
                value={email}
                required
                InputProps={{ readOnly: true }}
              />
            </Box>

            <Box mb={2}>
              <PasswordInput name="password" />
            </Box>
            <Box mb={2}>
              <PasswordInput name="confirmPassword" />
            </Box>
            <MKBox mt={3} mb={1}>
              <FormSubmit
                pendingText="creating account..."
                buttonText="sign up"
                color={color}
              />
            </MKBox>
            <Box mt={3} mb={1} textAlign="center">
              <MKTypography variant="button" color="text">
                이미 계정이 있으신가요?{" "}
                <MKTypography
                  component={Link}
                  href="/authentication/login"
                  variant="button"
                  color={color}
                  fontWeight="medium"
                  textGradient
                >
                  여기서 로그인
                </MKTypography>
              </MKTypography>
            </Box>
          </form>
        )}
      </Box>
    </Card>
  );
}
