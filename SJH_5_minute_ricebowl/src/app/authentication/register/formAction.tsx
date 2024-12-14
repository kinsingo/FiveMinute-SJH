"use server";
import { redirect } from "next/navigation";
import signup from "../lib/signup";
import nodemailer from "nodemailer";
import { randomInt } from "crypto";

import { isValidEmail } from "@/app/authentication/lib/util/validation";
import { getPublicCollection } from "@/MongoDB/db-manager";

async function sendVerificationMail(email:string, generatedCode: string)
{
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
    subject: "Email Verification",
    text: `Verification Code: **${generatedCode}**`,
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;  padding: 10px; background-color: #fff;">
      <div style="text-align: center; margin-bottom: 20px; width: 100%;background-color: #000;">
        <img src="${logoUrl}" alt="Company Logo" style="width: 100%; height: 100%; object-fit: contain;" />
      </div>
      <h3 style="text-align: center; color: #333;">Verification Code</h2>
      <h3 style="text-align: center; color: #33F;"><strong>${generatedCode}</strong></h3>
    </div>
  `,
  }
  await transporter.sendMail(mailOptions);
} 

async function emailVerificationServerAction(
  //@ts-ignore
  prevState: any,
  formData: FormData
) {
  const authData = {
    email: formData.get("email"),
  };

  const { isValid, message } = isValidEmail(authData.email as string);
  if (!isValid) {
    return {
      email : "",
      message: message,
      verificationCode: "",
      isValid: false,
    }
  }

  const collection = await getPublicCollection("users");
  const existingUser = await collection.findOne({ email: authData.email as string });
  if (existingUser) {
    return {
      email : "",
      message: "Email exists already",
      verificationCode: "",
      isValid: false,
    }
  }

  const generatedCode = randomInt(0, 1_000_000).toString().padStart(6, "0"); //(0~999999) 랜덤 숫자에서 만약 6자리가 안되면 앞에 0을 채움
  await sendVerificationMail(authData.email as string, generatedCode);
  return {
    email : authData.email as string,
    message: "A verification code has been sent to your email.",
    verificationCode: generatedCode,
    isValid: true,
  };
}

async function codeVerificationServerAction(
  //@ts-ignore
  prevState: any,
  formData: FormData
) {
  const authData = {
    inputCode: formData.get("inputCode"),
    verificationCode: formData.get("verificationCode"), //hidden input
  };

  if (authData.inputCode === authData.verificationCode) {
    return {
      message: "Code Verified successfully!",
      isVerified: true,
    };
  } else {
    return {
      message: "Verification failed. Please try again.",
      isVerified: false,
    };
  }
}

async function signUpServerAction(
  //@ts-ignore
  prevState: any,
  formData: FormData
) {
  const authData = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  try {
    await signup(authData);
  } catch (error: any) {
    return {
      message: error.message,
    }; //useActionState 에서 state 로 전달됨
  }

  //next-auth credentials 한계로, sign-up 이후 해당 아이디로 자동 로그인은 여기서 구현 불가
  redirect("/authentication/login");
}

export { emailVerificationServerAction, codeVerificationServerAction, signUpServerAction };
