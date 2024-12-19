"use client";
//import { useState } from "react";
import Link from "next/link";

// @mui material components
import Card from "@mui/material/Card";

// Material Kit 2 PRO React components
import Box from "@mui/material/Box";
import MKBox from "@/MKcomponents/MKBox";
import Typography from "@mui/material/Typography";
import MKTypography from "@/MKcomponents/MKTypography";

//Input Managers
import EmailInput from "../components/EmailInput";
import PasswordInput from "../components/PasswordInput";
import FormSubmit from "../components/formSubmit";
import { useActionState } from "react";
import ActionMessageDisplay from "../components/ActionMessageDisplay";
import signInServerAction from "./formAction";

export default function SignInPostForm() {
  const [actionData, formAction] = useActionState(signInServerAction, {
    message: "",
    sub_message: "",
  });

  const color = "info";

  return (
    <Card>
      <MKBox
        variant="gradient"
        bgColor={color}
        borderRadius="lg"
        coloredShadow={color}
        mx={2}
        mt={-3}
        p={2}
        mb={1}
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="medium" color="white" mt={1}>
          로그인
        </Typography>
        <MKTypography display="block" variant="button" color="white" my={1}>
          Enter your email and password to sign in
        </MKTypography>
        <MKTypography display="block" variant="button" mt={2}>
          {actionData && (
            <ActionMessageDisplay
              message={actionData.message}
              sub_message={actionData.sub_message}
            />
          )}
        </MKTypography>
      </MKBox>
      <Box pt={4} pb={2} px={3}>
        <form action={formAction}>
          <Box mb={2}>
            <EmailInput />
          </Box>
          <Box mb={2}>
            <PasswordInput name="password" />
          </Box>
          <Box mt={4}>
            <FormSubmit
              pendingText="logging in..."
              buttonText="sign in"
              color={color}
            />
          </Box>
          <Box mt={2} mb={1} textAlign="center">
            <MKTypography variant="button" color="text">
              계정이 없으신가요?{" "}
              <MKTypography
                component={Link}
                href="/authentication/register"
                variant="button"
                color={color}
                fontWeight="medium"
                textGradient
              >
                회원가입
              </MKTypography>
            </MKTypography>
            <br />
            <MKTypography variant="button" color="text">
                비밀번호를 잊으셨나요?{" "}
              <MKTypography
                component={Link}
                href="/authentication/forget-password"
                variant="button"
                color={color}
                fontWeight="medium"
                textGradient
              >
                여기서 재설정
              </MKTypography>
            </MKTypography>
          </Box>
        </form>
      </Box>
    </Card>
  );
}
