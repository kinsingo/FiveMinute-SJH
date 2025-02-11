import { NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";

//Sign-In
export async function POST(req: Request) {
  try {
    // 요청 본문에서 JSON 데이터를 읽음
    //attendanceIndex : 0 -> 첫번째 출/퇴근
    //attendanceIndex : 1 -> 두번째 출/퇴근
    //attendanceIndex : 2 -> 세번째 출/퇴근
    const date = getTodayDate();
    const { email, timestamp, location, attendanceIndex, isCheckIn } =
      await req.json();
    const collection = await getPublicCollection(email + "_attendance");
    let attendance = await collection.findOne({ email, date });
    if (!attendance) {
      attendance = getInitialData({ email, date });
      await collection.insertOne(attendance);
    }

    // ✅ 출근 / 퇴근 필드 및 위치 업데이트
    const updateFields = {
      [isCheckIn
        ? `checkIn.${attendanceIndex}`
        : `checkOut.${attendanceIndex}`]: timestamp,
      [isCheckIn
        ? `checkInLocation.${attendanceIndex}`
        : `checkOutLocation.${attendanceIndex}`]: location,
    };
    await collection.updateOne({ email, date }, { $set: updateFields });

    // ✅ 최신 데이터 직접 Read 해서 가져오기
    const updatedAttendance = await collection.findOne({ email, date });

    if (!updatedAttendance) {
      return NextResponse.json({
        success: false,
        message: "출퇴근 데이터 저장 후 조회 실패",
      });
    }

    // ✅ 총 근무 시간 자동 계산 (모든 출근/퇴근 시간이 입력된 경우)
    const { checkIn, checkOut } = updatedAttendance;
    const workHours = calculateWorkHours(checkIn, checkOut);
    if (workHours > 0)
      await collection.updateOne({ email, date }, { $set: { workHours } });

    return NextResponse.json({
      success: true,
      message: "출퇴근 데이터 저장 성공",
      workHours,
    });
  } catch (error) {
    console.error("Error saving data:", error); //error handling is necessary for Typescript
    return NextResponse.json({
      success: false,
      message: "데이터 저장 실패",
    });
  }
}

// ✅ 로그인 여부 확인 (GET)
export async function GET(req: Request) {
  try {
    const date = getTodayDate();
    const url = new URL(req.url);
    const email = url.searchParams.get("email") as string; // ✅ GET 요청 시 데이터 추출 방식 변경
    if (!email) {
      return NextResponse.json(
        { message: "이메일을 전달해주세요." },
        { status: 400 }
      );
    }

    const collection = await getPublicCollection(email + "_attendance");
    let attendance = await collection.findOne({ email, date });
    if (!attendance) {
      attendance = getInitialData({ email, date });
      await collection.insertOne(attendance);
    }

    return NextResponse.json(
      {
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        checkInLocation: attendance.checkInLocation,
        checkOutLocation: attendance.checkOutLocation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching previous data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

function getTodayDate() {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .replace(/\. /g, "-")
    .replace(/\.$/, "");
}

import { ObjectId } from "mongodb";

function getInitialData({ email, date }: { email: string; date: string }) {
  return {
    _id: new ObjectId(),
    email,
    date,
    checkIn: ["", "", ""],
    checkOut: ["", "", ""],
    checkInLocation: ["", "", ""],
    checkOutLocation: ["", "", ""],
    status: "", // 기본값
    workHours: 0, // 기본값
  };
}

function calculateWorkHours(checkIn: string[], checkOut: string[]): number {
  let totalSeconds = 0;

  for (let i = 0; i < checkIn.length; i++) {
    if (!checkIn[i] || !checkOut[i]) continue; // 빈 값이면 건너뜀

    const checkInParts = checkIn[i].split(":").map((num) => parseInt(num, 10));
    const checkOutParts = checkOut[i]
      .split(":")
      .map((num) => parseInt(num, 10));

    if (checkInParts.length !== 3 || checkOutParts.length !== 3) continue; // 형식이 맞지 않으면 무시

    const [inHour, inMinute, inSecond] = checkInParts;
    const [outHour, outMinute, outSecond] = checkOutParts;

    // ✅ 총 초 단위로 변환하여 차이 계산
    const checkInTotalSeconds = inHour * 3600 + inMinute * 60 + inSecond;
    const checkOutTotalSeconds = outHour * 3600 + outMinute * 60 + outSecond;

    totalSeconds += checkOutTotalSeconds - checkInTotalSeconds;
  }

  return totalSeconds / 3600; // ✅ 초 → 시간 변환
}
