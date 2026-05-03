import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";
import { isValidEmail } from "@/app/authentication/lib/util/validation";
import { getPublicCollection } from "@/MongoDB/db-manager";
import { USERS_COLLECTION_NAME } from "../kitchen-sense-collection";

export async function EmailVerification(
  req: Request,
  isExistanceCheck: boolean
) {
  const { email } = await req.json();

  const { isValid, message } = isValidEmail(email);
  if (!isValid) {
    return NextResponse.json(
      {
        email: "",
        message,
        verificationCode: "",
        isValid: false,
      },
      { status: 400 }
    );
  }

  const collection = await getPublicCollection(USERS_COLLECTION_NAME);
  const existingUser = await collection.findOne({ email });

  if (isExistanceCheck && !existingUser) {
    return NextResponse.json(
      {
        email: "",
        message: "이메일이 존재하지 않습니다",
        verificationCode: "",
        isValid: false,
      },
      { status: 409 }
    );
  }

  if (!isExistanceCheck && existingUser) {
    return NextResponse.json(
      {
        email: "",
        message: "이미 존재하는 이메일 입니다",
        verificationCode: "",
        isValid: false,
      },
      { status: 409 }
    );
  }

  const verificationCode = randomInt(0, 1_000_000).toString().padStart(6, "0");

  const transporter = nodemailer.createTransport({
    service: "naver",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const logoUrl =
    "https://raw.githubusercontent.com/kinsingo/Img_URL/main/KitchenSense-Mail-Header.PNG";

  const mailOptions = {
    from: process.env.SMTP_USER!,
    to: email,
    subject: "[KitchenSense] 이메일 검증",
    text: `검증 코드: **${verificationCode}**`,
    html: `
      <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 10px; background: #fff;">
        <div style="text-align: center; margin-bottom: 20px; background-color: #000;">
          <img src="${logoUrl}" alt="Logo" style="width: 100%; object-fit: contain;" />
        </div>
        <h3 style="text-align: center; color: #333;">검증 코드</h3>
        <h3 style="text-align: center; color: #33F;"><strong>${verificationCode}</strong></h3>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  return NextResponse.json({
    email,
    message: "인증 코드가 이메일로 전송되었습니다.",
    verificationCode,
    isValid: true,
  });
}
