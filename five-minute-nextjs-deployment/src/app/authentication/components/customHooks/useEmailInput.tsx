'use client';

import { useState } from "react";

export default function useEmailInput() {
    const [enteredEmail, setEnteredEmail] = useState("");
    const [emailDidEdit, setEmailDidEdit] = useState(false);
    const emailIsInvalid = (enteredEmail === "")? false : (emailDidEdit && !enteredEmail.includes("@"));

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
      setEnteredEmail(event.target.value);
      setEmailDidEdit(false);
    }
  
    function handleEmailInputBlur() {
      setEmailDidEdit(true);
    }

    return {
        enteredEmail,
        emailIsInvalid,
        handleEmailChange,
        handleEmailInputBlur
    }
}