"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/app/api/auth/next-auth";

export default async function signInServerAction(
  //@ts-ignore
  prevState: any,
  formData: FormData
) {
  const authData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    await signIn("credentials", {
      redirect: false, // 이 옵션으로 리다이렉션을 막음
      email: authData.email,
      password: authData.password,
    });
  } catch (error: any) {
    switch (error.type) {
      case "CredentialsSignin":
        return {
          message: "Login Error Occured",
          sub_message: "Account does not exist or the password is incorrect.",
        };
      default:
        return {
          message: "Login Error Occured",
          sub_message: "Something went wrong",
        };
    }
  }
  redirect("/");
}
