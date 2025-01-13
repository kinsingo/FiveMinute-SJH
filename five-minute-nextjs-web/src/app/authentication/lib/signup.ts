import { addUser } from "./data/user";
import { isValidEmail, isValidText, isPasswordEqual } from "./util/validation";
import { getPublicCollection } from "@/MongoDB/db-manager";

interface SignUpProps {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  confirmPassword: FormDataEntryValue | null;
}

export default async function signup({
  email,
  password,
  confirmPassword,
}: SignUpProps) {
  if (!email || !password || !confirmPassword)
    throw new Error("All inputs are required.");


  const { isValid, message } = isValidEmail(email.toString());
  if (!isValid) {
    throw new Error(message);
  }

  const collection = await getPublicCollection("users");
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error("Email exists already.");
  }

  if (!isValidText(password.toString(), 8)) {
    throw new Error("Invalid password. Must be at least 8 characters long.");
  }

  if (!isPasswordEqual(password.toString(), confirmPassword.toString())) {
    throw new Error("Passwords do not match.");
  }

  // 1. 사용자 계정을 추가
  await addUser(email.toString(), password.toString());
}
