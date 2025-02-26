import { NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";
import { getDateBeforeDays } from "@/utils/timeManager";

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

    // 100일 이내 데이터 가져오기 (date 기준 최신순 정렬)
    const _100daysAgo = getDateBeforeDays(100);
    const attendanceData = await collection
      .find({ date: { $gte: _100daysAgo } }) // date 기준 필터링
      .sort({ date: -1 }) // 최신순 정렬
      .toArray();

    if (attendanceData.length === 0) {
      return NextResponse.json(
        { message: `${email}님의 데이터가 없습니다.` },
        { status: 400 }
      );
    } else {
      return NextResponse.json(attendanceData);
    }
  } catch (error) {
    console.error("Error fetching previous data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
