'use client';

import { useState } from "react";

export default function usePasswordInput(minLength: number) {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordDidEdit, setPasswordDidEdit] = useState(false);
  const passwordIsInvalid = (enteredPassword === "")? false: passwordDidEdit && enteredPassword.length < minLength;

  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEnteredPassword(event.target.value);
    setPasswordDidEdit(false);
  }

  function handlePasswordInputBlur() {
    setPasswordDidEdit(true);
  }

  return {
    enteredPassword,
    passwordIsInvalid,
    handlePasswordChange,
    handlePasswordInputBlur,
  };
}
