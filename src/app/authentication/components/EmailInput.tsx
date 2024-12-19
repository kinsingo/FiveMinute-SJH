"use client";
import useEmailInput from "./customHooks/useEmailInput";
import TextField from "@mui/material/TextField";

export default function EmailInput() {
  const {
    enteredEmail,
    emailIsInvalid,
    handleEmailChange,
    handleEmailInputBlur,
  } = useEmailInput();

  const warningMessage = emailIsInvalid
    ? "Please enter a valid email address"
    : null;

  return (    
    <TextField
      error={emailIsInvalid}
      type="email"
      name="email"
      label="Email"
      fullWidth
      onBlur={handleEmailInputBlur}
      onChange={handleEmailChange}
      value={enteredEmail}
      helperText={warningMessage}
      required
    />
  );
}
