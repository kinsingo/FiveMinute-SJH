import { NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email") as string;
    if (!email) {
      return NextResponse.json(
        { message: "이메일을 전달해주세요." },
        { status: 400 }
      );
    }
    const collection = await getPublicCollection(email + "_attendance");

    const attendanceData = await collection.find().toArray();
    if (attendanceData.length === 0) {
      return NextResponse.json(
        { message: `${email}님의 데이터가 없습니다.` },
        { status: 400 }
      );
    } else {
      return NextResponse.json(attendanceData);
    }
  } catch {
    return NextResponse.json(
      { message: "데이터를 가져오는데 실패 하였습니다" },
      { status: 500 }
    );
  }
}
