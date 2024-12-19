"use client";

import usePasswordInput from "./customHooks/usePasswordInput";
import TextField from "@mui/material/TextField";

export default function PasswordInput({ name }: { name: string }) {
  const minLength = 8;
  const {
    enteredPassword,
    passwordIsInvalid,
    handlePasswordChange,
    handlePasswordInputBlur,
  } = usePasswordInput(minLength);

  const warningMessage = passwordIsInvalid
    ? `Please enter a valid password (>${minLength - 1} characters)`
    : null;

  return (
    <TextField
      error={passwordIsInvalid}
      type="password"
      name={name}
      label={name}
      fullWidth
      onBlur={handlePasswordInputBlur}
      onChange={handlePasswordChange}
      value={enteredPassword}
      helperText={warningMessage}
      required
    />
  );
}
