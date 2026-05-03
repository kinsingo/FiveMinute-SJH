import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { inputCode, verificationCode } = await req.json();

  if (inputCode === verificationCode) {
    return NextResponse.json({
      message: "Code Verified successfully!",
      isVerified: true,
    });
  } else {
    return NextResponse.json(
      {
        message: "Verification failed. Please try again.",
        isVerified: false,
      },
      { status: 400 }
    );
  }
}
