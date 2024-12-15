"use server";

import { findUserByEmail, saveResetToken } from "../lib/data/user";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getPasswordResetToken } from "../lib/util/tokenManager";

export default async function ForgetPasswordServerAction(
  //@ts-ignore
  prevState: any,
  formData: FormData
) {
  const authData = {
    email: formData.get("email"),
  };
  try {
    const user = await findUserByEmail(authData.email as string);
    const resetToken = crypto.randomBytes(32).toString("hex");
    await sendResetEmail(resetToken, user.email);
    await saveTokens(resetToken, user.email);

    // 리다이렉트 및 성공 메시지
    return {
      message: "Reset link sent",
      sub_message: "Check your email",
    };
  } catch (error: any) {
    return {
      message: "Error Occured",
      sub_message: error.message,
    };
  }
}

// 이메일 발송 함수
async function sendResetEmail(resetToken: string, email: string) {
  const resetLink = getResetLink(resetToken, email);
  const transporter = nodemailer.createTransport({
    service: "naver", // 원하는 이메일 서비스
    auth: {
      user: process.env.SMTP_USER, // 이메일 ID
      pass: process.env.SMTP_PASS, // 이메일 패스워드
    },
  });

  const logoUrl = "https://raw.githubusercontent.com/kinsingo/Img_URL/main/Five-Min-Mail-Header.PNG";
  //text는 HTML을 지원하지 않는 이메일 클라이언트를 위한 백업 역할을 합니다.
  //그러므로 이메일 전송 시, text와 html을 둘 다 제공하는 것이 가장 좋습니다
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset Request",
    text: `Please click the following link to reset your password: ${resetLink} \n This link is only valid for an hour`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;  padding: 20px; background-color: #fff;">
      <div style="text-align: center; margin-bottom: 20px; width: 100%;background-color: #000;">
        <img src="${logoUrl}" alt="Company Logo" style="width: 100%; height: 100%; object-fit: contain;" />
      </div>
      <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
      <p style="text-align: center; color: #555; line-height: 1.5;">
        Please click the button below to reset your password. 
      </p>
      <p style="text-align: center; color: #555; line-height: 1.5;">
        This link is only valid for an hour.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 12px; color: #777; text-align: center;">
        If you didn’t request a password reset, please ignore this email.
      </p>
    </div>
  `,
    //html: `<p>Please click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>
    //<p> This link is only valid for an hour</p>`,
  };

  await transporter.sendMail(mailOptions);
}

async function saveTokens(resetToken: string, email: string) {
  const passwordResetToken = getPasswordResetToken(resetToken);
  const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1시간 유효
  await saveResetToken(email, passwordResetToken, passwordResetExpires);
}

function getResetLink(resetToken: string, email: string) {
  return `${process.env.BASE_URL}/authentication/reset-password?token=${resetToken}&email=${email}`;
}
