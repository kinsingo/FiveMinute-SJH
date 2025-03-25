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
import FormSubmit from "../components/formSubmit";
import { useActionState } from "react";
import ActionMessageDisplay from "../components/ActionMessageDisplay";
import ForgetPasswordServerAction from "./formAction";

export default function ForgetPasswordPostForm() {
  const color = "primary";

  const [actionData, formAction] = useActionState(ForgetPasswordServerAction, {
    message: "",
    sub_message: "",
  });
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
          Forget Password
        </Typography>
        <MKTypography display="block" variant="button" color="white" my={1}>
          Enter your email to get new password
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
      <Box pt={4} pb={3} px={3}>
        <form action={formAction}>
          <Box mb={2}>
            <EmailInput />
          </Box>
          <Box mt={4} mb={1}>
            <FormSubmit
              pendingText="sending..."
              buttonText="send new password to email"
              color={color}
            />
          </Box>
          <Box mt={3} mb={1} textAlign="center">
            <MKTypography variant="button" color="text">
              Remember password?{" "}
              <MKTypography
                component={Link}
                href="/authentication/login"
                variant="button"
                color={color}
                fontWeight="medium"
                textGradient
              >
                Login Here
              </MKTypography>
            </MKTypography>
          </Box>
        </form>
      </Box>
    </Card>
  );
}
