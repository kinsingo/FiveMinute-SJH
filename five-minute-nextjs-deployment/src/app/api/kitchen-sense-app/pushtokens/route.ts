import { NextRequest } from "next/server";
import { saveToken, getTokens, deleteToken } from "../../components/token";
import { PUSHTOKENS_COLLECTION_NAME } from "../kitchen-sense-collection";

// 토큰 저장
export async function POST(req: NextRequest) {
  return saveToken({ req, COLLECTION_NAME: PUSHTOKENS_COLLECTION_NAME });
}

// 저장된 모든 토큰 조회
export async function GET() {
  return getTokens({ COLLECTION_NAME: PUSHTOKENS_COLLECTION_NAME });
}

// ✅ 특정 또는 여러 개의 푸시 토큰 삭제
export async function DELETE(req: NextRequest) {
  return deleteToken({ req, COLLECTION_NAME: PUSHTOKENS_COLLECTION_NAME });
}
