import { NextResponse } from "next/server";
import { isValidPassword } from "@/app/authentication/lib/util/validation";
import { getPublicCollection } from "@/MongoDB/db-manager";
import jwt from "jsonwebtoken";

interface LoginRequestBody {
  email: string;
  password: string;
}

const JWT_SECRET = "lad2a4ya9#s2+$%F@wdbf#Nws4J@g4zdtWgM#fhPU+Vjx7sV$F@5mimute"; // ⚠️ 환경 변수로 관리 필요

// ✅ JWT 생성 함수
const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin, isDeveloper: user.isDeveloper },
    JWT_SECRET,
    { expiresIn: "30d" } // 30일 동안 유효한 JWT
  );
};

//Sign-In
export async function POST(req: Request) {
  try {
    // 요청 본문에서 JSON 데이터를 읽음
    const { email, password }: LoginRequestBody = await req.json();

    // 이메일로 사용자 조회
    const collection = await getPublicCollection("users");
    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: `이메일 ${email}에 해당하는 사용자를 찾을 수 없습니다.`,
      });
    }

    // 비밀번호 유효성 검사
    const pwIsValid = await isValidPassword(password, user.password);
    if (!pwIsValid) {
      return NextResponse.json({
        success: false,
        message: "잘못된 비밀번호가 입력되었습니다.",
      });
    }

    // ✅ JWT 생성
    const token = generateToken(user);

    // 로그인 성공 시 사용자 데이터 반환
    return NextResponse.json({
      success: true,
      message: `로그인에 성공했습니다.`,
      token, // 🔹 App에서 이 토큰을 저장해야 함 (DB가 아닌 App에 Local Storage에 저장되는 부분)
      user: {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      isDeveloper: user.isDeveloper,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error.message);
    return NextResponse.json({
      success: false,
      message: error.message || "내부 서버 오류",
    });
  }
}

// ✅ 로그인 여부 확인 (GET)
export async function GET(req: Request) {
  try {
    // 요청 헤더에서 JWT 가져오기
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "인증 토큰이 없습니다." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <토큰>"에서 토큰 부분만 추출
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    return NextResponse.json({
      success: true,
      message: `${decoded.email} 님이 로그인 되어 있습니다.`,
      user: {
        id: decoded.id,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
        isDeveloper: decoded.isDeveloper,
      },
    });
  } catch (error: any) {
    console.error("Token verification error:", error.message);
    return NextResponse.json({ success: false, message: "유효하지 않은 토큰입니다." }, { status: 401 });
  }
}