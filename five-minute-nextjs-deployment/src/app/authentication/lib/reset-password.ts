import { modifyPassword, findTokenValidUser } from "./data/user";
import { isValidEmail, isValidText, isPasswordEqual } from "./util/validation";

interface ResetPasswordProps {
  email: FormDataEntryValue | null;
  token: FormDataEntryValue | null;
  newPassword: FormDataEntryValue | null;
  confirmNewPassword: FormDataEntryValue | null;
  collectionName: string;
}

export default async function resetPassword({
  email,
  token,
  newPassword,
  confirmNewPassword,
  collectionName,
}: ResetPasswordProps) {
  if (!email || !token || !newPassword || !confirmNewPassword)
    throw new Error("모든 입력이 필요합니다.");

  const { isValid, message } = isValidEmail(email.toString());
  if (!isValid) {
    throw new Error(message);
  }

  await findTokenValidUser(email.toString(), token.toString(), collectionName);

  if (!isValidText(newPassword.toString(), 8)) {
    throw new Error(
      "새로운 비밀번호가 유효하지 않습니다. 최소 8자 이상이어야 합니다."
    );
  }
  
  if (!isPasswordEqual(newPassword.toString(), confirmNewPassword.toString())) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  await modifyPassword(
    email.toString(),
    newPassword.toString(),
    collectionName
  );
}
