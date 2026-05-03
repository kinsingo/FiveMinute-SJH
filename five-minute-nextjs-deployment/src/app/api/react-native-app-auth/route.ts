import { logIn, isLogIn, deleteAccount } from "../components/auth";

const COLLECTION_NAME = "users";

//Sign-In
export async function POST(req: Request) {
  return logIn(req, COLLECTION_NAME);
}

// ✅ 로그인 여부 확인 (GET)
export async function GET(req: Request) {
  return isLogIn(req);
}

// ✅ 계정 삭제 API
export async function DELETE(req: Request) {
  return deleteAccount(req, COLLECTION_NAME);
}
