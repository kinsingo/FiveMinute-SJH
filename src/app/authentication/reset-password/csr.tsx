"use client";
// @mui material components
import Card from "@mui/material/Card";

// Material Kit 2 PRO React components
import MKBox from "@/MKcomponents/MKBox";
import Box from "@mui/material/Box";
import MKTypography from "@/MKcomponents/MKTypography";

//Input Managers
import TextField from "@mui/material/TextField";
import PasswordInput from "../components/PasswordInput";
import FormSubmit from "../components/formSubmit";
import { useActionState } from "react";
import ActionMessageDisplay from "../components/ActionMessageDisplay";
import resetPasswordServerAction from "./formAction";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";

export default function ResetPasswordPostForm() {
  const [actionData, formAction] = useActionState(resetPasswordServerAction, {
    message: "",
    sub_message: "",
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    console.log(
      "Token or email not found, this page shouldn't accessed manually like this"
    );
    redirect("/");
  }

  const color = "secondary";
  return (
    <Card>
      <MKBox
        variant="gradient"
        bgColor={color}
        borderRadius="lg"
        coloredShadow={color}
        mx={2}
        mt={-3}
        py={2}
        mb={1}
        textAlign="center"
      >
        <MKTypography variant="h3" fontWeight="medium" color="white" mt={1}>
          비밀번호 재설정
        </MKTypography>
        <MKTypography display="block" variant="button" color="white" my={1}>
          Reset your password here
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
          <input type="hidden" name="token" value={token} />
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
            <PasswordInput name="newPassword" />
          </Box>
          <Box mb={2}>
            <PasswordInput name="confirmNewPassword" />
          </Box>
          <Box mt={6} mb={1}>
            <FormSubmit
              pendingText="resetting password..."
              buttonText="reset"
              color={color}
            />
          </Box>
        </form>
      </Box>
    </Card>
  );
}
