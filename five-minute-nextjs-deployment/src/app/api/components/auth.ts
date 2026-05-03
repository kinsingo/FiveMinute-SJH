import { NextResponse } from "next/server";
import { isValidPassword } from "@/app/authentication/lib/util/validation";
import {
  getPublicCollection,
  createPublicCollection,
  getConnectedPublicDB,
} from "@/MongoDB/db-manager";
import jwt from "jsonwebtoken";

interface LoginRequestBody {
  email: string;
  password: string;
}

// ✅ JWT 생성 함수
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      isDeveloper: user.isDeveloper,
    },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: "30d" } // 30일 동안 유효한 JWT
  );
};

//Sign-In
export async function logIn(req: Request, COLLECTION_NAME: string) {
  try {
    // 요청 본문에서 JSON 데이터를 읽음
    const { email, password }: LoginRequestBody = await req.json();

    // 이메일로 사용자 조회
    const collection = await getPublicCollection(COLLECTION_NAME);
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

    // ✅ 출퇴근 데이터 컬렉션 생성 (없는 경우에만 생성)
    await createPublicCollection(email + "_attendance");

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
    return NextResponse.json({
      success: false,
      message: error.message || "내부 서버 오류",
    });
  }
}

// ✅ 로그인 여부 확인 (GET)
export async function isLogIn(req: Request) {
  try {
    // 요청 헤더에서 JWT 가져오기
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1]; // "Bearer <토큰>"에서 토큰 부분만 추출
    const decoded = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET as string
    ) as any;

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
    return NextResponse.json(
      { success: false, message: "유효하지 않은 토큰입니다." },
      { status: 401 }
    );
  }
}

// ✅ 계정 삭제 API
export async function deleteAccount(req: Request, COLLECTION_NAME: string) {
  try {
    // 삭제할 계정의 이메일을 요청 본문에서 가져옴
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "삭제할 계정의 이메일이 필요합니다." },
        { status: 400 }
      );
    }

    // 요청 헤더에서 JWT 가져오기
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1]; // "Bearer <토큰>"에서 토큰 부분만 추출
    const decoded = jwt.verify(
      token,
      process.env.JWT_TOKEN_SECRET as string
    ) as any;

    // MongoDB 연결 및 사용자 조회
    const usersCollection = await getPublicCollection(COLLECTION_NAME);
    const userToDelete = await usersCollection.findOne({ email });
    if (!userToDelete) {
      return NextResponse.json(
        {
          success: false,
          message: "해당 이메일을 가진 사용자를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 본인이거나 관리자 권한이 있는 경우만 삭제 가능
    if (decoded.email !== email && !decoded.isAdmin) {
      return NextResponse.json(
        { success: false, message: "계정을 삭제할 권한이 없습니다." },
        { status: 403 }
      );
    }

    // ✅ `email + "_attendance"` 컬렉션 삭제 (존재하는 경우만)
    try {
      const db = await getConnectedPublicDB();
      if (!db) {
        throw new Error("데이터베이스 연결에 실패했습니다.");
      }
      const collections = await db
        .listCollections({ name: email + "_attendance" })
        .toArray();
      if (collections.length > 0) {
        const attendanceCollection = db.collection(email + "_attendance");
        await attendanceCollection.drop();
        console.log(`컬렉션 ${email}_attendance 삭제 완료`);
      } else {
        console.log(`컬렉션 ${email}_attendance 존재하지 않음`);
      }
    } catch (error: any) {
      console.error(
        `컬렉션 ${email}_attendance 삭제 중 오류 발생:`,
        error.message
      );
    }

    // ✅ 계정 삭제 수행
    await usersCollection.deleteOne({ email });
    console.log(`사용자 ${email} 삭제 완료`);

    return NextResponse.json({
      success: true,
      message: "계정이 성공적으로 삭제되었습니다.",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "내부 서버 오류" },
      { status: 500 }
    );
  }
}
