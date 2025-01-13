import { findUserByEmail } from "./data/user";
import { isValidPassword } from "./util/validation";

interface LoginProps {
  email: string;
  password: string;
}

export default async function login({ email, password }:LoginProps) {
  const user = await findUserByEmail(email);
  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    throw new Error("Invalid password entered.");
  }
  return user; //user 객체를 반환하여 인증 성공 시 사용자 프로필 데이터가 세션에 저장될 수 있도록 합니다
}
