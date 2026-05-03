import { findUserByEmail } from "./data/user";
import { isValidPassword } from "./util/validation";

interface LoginProps {
  email: string;
  password: string;
  collectionName: string;
}

export default async function login({
  email,
  password,
  collectionName,
}: LoginProps) {
  const user = await findUserByEmail(email, collectionName);
  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    throw new Error("잘못된 비밀번호가 입력되었습니다.");
  }
  return user; //user 객체를 반환하여 인증 성공 시 사용자 프로필 데이터가 세션에 저장될 수 있도록 합니다
}
