import { NextResponse } from "next/server";
import { modifyPassword } from "@/app/authentication/lib/data/user";
import {
  isValidEmail,
  isValidText,
  isPasswordEqual,
} from "@/app/authentication/lib/util/validation";
import { getPublicCollection } from "@/MongoDB/db-manager";

import { USERS_COLLECTION_NAME } from "../kitchen-sense-collection";

export async function POST(req: Request) {
  const { email, newPassword, confirmNewPassword } = await req.json();
  try {
    if (!email || !newPassword || !confirmNewPassword)
      throw new Error("모든 입력이 필요합니다.");

    const collection = await getPublicCollection(USERS_COLLECTION_NAME);
    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      throw new Error("이메일이 존재하지 않습니다.");
    }

    const { isValid, message } = isValidEmail(email.toString());
    if (!isValid) {
      throw new Error(message);
    }

    if (!isValidText(newPassword.toString(), 8)) {
      throw new Error(
        "새로운 비밀번호가 유효하지 않습니다. 최소 8자 이상이어야 합니다."
      );
    }

    if (
      !isPasswordEqual(newPassword.toString(), confirmNewPassword.toString())
    ) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }
    await modifyPassword(
      email.toString(),
      newPassword.toString(),
      USERS_COLLECTION_NAME
    );
    return NextResponse.json({
      success: true,
      message: `패스워드 변경에 성공했습니다.`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "내부 서버 오류",
    });
  }
}
