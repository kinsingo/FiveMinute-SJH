import { NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";


interface AccountInformation {
  email: string; //이건 수정하는게 아님, 그러나 찾기 위해서 필요
  nickname: string;
  realname: string;
  birthdate: string;
  position: string; // 직원, 매니저, 점장, 사장
  gender: string; // 남자, 여자 (기본값 설정)
}

export async function POST(req: Request) {
  try {
    // 요청 본문에서 JSON 데이터를 읽음
    const {
      email,
      nickname,
      realname,
      birthdate,
      position,
      gender,
    }: AccountInformation = await req.json();

    // 이메일로 사용자 조회
    const collection = await getPublicCollection("users");
    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: `이메일 ${email}에 해당하는 사용자를 찾을 수 없습니다.`,
      });
    }

    const birthdateRegex = /^(?:\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01]))$/;
    if (!birthdateRegex.test(birthdate)) {
      return NextResponse.json({
      success: false,
      message: "유효하지 않은 생년월일 형식입니다.",
      });
    }


    // ✅ 계정관리 데이터 저장
    await collection.updateOne(
      { email },
      { $set: { nickname, realname, birthdate, position, gender } }
    );

    return NextResponse.json({
      success: true,
      message: `계정관리 데이터 저장에 성공했습니다.`,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "내부 서버 오류",
    });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email") as string; // ✅ GET 요청 시 데이터 추출 방식 변경
    if (!email) {
      return NextResponse.json(
        { message: "이메일을 전달해주세요." },
        { status: 400 }
      );
    }

    const collection = await getPublicCollection("users");
    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: `이메일 ${email}에 해당하는 사용자를 찾을 수 없습니다.`,
      });
    }

    return NextResponse.json(
      {
        nickname: user.nickname,
        realname: user.realname,
        birthdate: user.birthdate,
        position: user.position,
        gender: user.gender,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}