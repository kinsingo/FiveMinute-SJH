import { modifyPassword, findTokenValidUser } from "./data/user";
import { isValidEmail, isValidText, isPasswordEqual } from "./util/validation";

interface ResetPasswordProps {
  email: FormDataEntryValue | null;
  token: FormDataEntryValue | null;
  newPassword: FormDataEntryValue | null;
  confirmNewPassword: FormDataEntryValue | null;
}

export default async function resetPassword({
  email,
  token,
  newPassword,
  confirmNewPassword,
}: ResetPasswordProps) {
  if (!email || !token || !newPassword || !confirmNewPassword)
    throw new Error("All inputs are required.");

  const { isValid, message } = isValidEmail(email.toString());
  if (!isValid) {
    throw new Error(message);
  }

  await findTokenValidUser(email.toString(), token.toString());

  if (!isValidText(newPassword.toString(), 8)) {
    throw new Error(
      "Invalid new password. Must be at least 8 characters long."
    );
  }

  if (!isPasswordEqual(newPassword.toString(), confirmNewPassword.toString())) {
    throw new Error("Passwords do not match.");
  }

  await modifyPassword(email.toString(), newPassword.toString());
}
