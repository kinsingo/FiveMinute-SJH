import { addUser } from "./data/user";
import { isValidEmail, isValidText, isPasswordEqual } from "./util/validation";
import { getPublicCollection } from "@/MongoDB/db-manager";

interface SignUpProps {
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
  confirmPassword: FormDataEntryValue | null;
  collectionName: string;
}

export default async function signup({
  email,
  password,
  confirmPassword,
  collectionName,
}: SignUpProps) {
  if (!email || !password || !confirmPassword)
    throw new Error("모든 입력이 필요합니다.");

  const { isValid, message } = isValidEmail(email.toString());
  if (!isValid) {
    throw new Error(message);
  }

  const collection = await getPublicCollection(collectionName);
  const existingUser = await collection.findOne({ email });
  if (existingUser) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  if (!isValidText(password.toString(), 8)) {
    throw new Error(
      "비밀번호가 유효하지 않습니다. 최소 8자 이상이어야 합니다."
    );
  }

  if (!isPasswordEqual(password.toString(), confirmPassword.toString())) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  // 1. 사용자 계정을 추가
  await addUser(email.toString(), password.toString(), collectionName);
}
