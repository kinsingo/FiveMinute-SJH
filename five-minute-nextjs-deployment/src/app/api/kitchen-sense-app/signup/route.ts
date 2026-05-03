import { NextResponse } from "next/server";
import signup from "@/app/authentication/lib/signup";
import { USERS_COLLECTION_NAME } from "../kitchen-sense-collection";

export async function POST(req: Request) {
  const { email, password, confirmPassword } = await req.json();

  try {
    await signup({
      email,
      password,
      confirmPassword,
      collectionName: USERS_COLLECTION_NAME,
    });
    return NextResponse.json({ message: "계정 생성을 성공 하였습니다" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
