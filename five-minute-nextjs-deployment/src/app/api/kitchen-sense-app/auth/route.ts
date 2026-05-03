import { logIn, isLogIn, deleteAccount } from "../../components/auth";
import {USERS_COLLECTION_NAME} from "../kitchen-sense-collection";

//Sign-In
export async function POST(req: Request) {
  return logIn(req, USERS_COLLECTION_NAME);
}

// ✅ 로그인 여부 확인 (GET)
export async function GET(req: Request) {
  return isLogIn(req);
}

// ✅ 계정 삭제 API
export async function DELETE(req: Request) {
  return deleteAccount(req, USERS_COLLECTION_NAME);
}
