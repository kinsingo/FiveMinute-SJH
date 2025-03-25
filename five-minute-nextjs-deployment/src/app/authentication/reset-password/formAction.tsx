"use server";
import { redirect } from "next/navigation";
import resetPassword from "../lib/reset-password";

export default async function resetPasswordServerAction(
  //@ts-ignore
  prevState: any,
  formData: FormData
) {
  const authData = {
    email: formData.get("email"),
    token: formData.get("token"), 
    newPassword: formData.get("newPassword"),
    confirmNewPassword : formData.get("confirmNewPassword")
  };

  try {
    await resetPassword(authData);
  } catch (error: any) {
    return {
      message: "Reset P/W Error Occured",
      sub_message: error.message,
    }; //useActionState 에서 state 로 전달됨
  }

  //next-auth credentials 한계로, reset-password 이후 해당 아이디로 자동 로그인은 여기서 구현 불가
  redirect("/authentication/login");
}
