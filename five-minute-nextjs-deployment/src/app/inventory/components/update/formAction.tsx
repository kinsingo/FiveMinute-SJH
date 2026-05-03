"use server";
import { auth } from "@/app/api/auth/next-auth";
import { signInServerAction } from "@/app/api/auth/components/auth-server-action";
import { getPublicCollection } from "@/MongoDB/db-manager";
import { redirect } from "next/navigation";

export default async function updateDatabaseServerAction(
  //@ts-ignore
  prevState: any,
  formData: FormData
) {
  const session = await auth();
  if (!session) await signInServerAction();
  if (!session || !session.user || !session.user.email)
    return { message: "No User Email" };

  const email = session.user.email as string;
  //const timestamp = new Date().toISOString(); // ISO 형식의 날짜/시간
  let timestamp = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Seoul",
  }).format(new Date());

  // 후처리: "오후 05" → "오후 5", "오전 11" → "오전 11"
  // Intl.DateTimeFormat 처리 방식이 React Native와 다름, 그렇기에 아래와 같은 후처리해야 Sort 정상 동작함
  timestamp = timestamp.replace(/(오전|오후) 0?(\d):/, "$1 $2:");

  const inventoryData: any[] = [];
  const collectionName = formData.get("collectionName") as string;
  const redirectPath = formData.get("redirectPath") as string;

  formData.forEach((value, key) => {
    const [index, field] = key.split("#"); // `index#field` 형태를 분리
    const rowIndex = parseInt(index);
    if (!inventoryData[rowIndex]) {
      inventoryData[rowIndex] = {};
    }
    inventoryData[rowIndex][field] = value;
  });

  try {
    const collection = await getPublicCollection(collectionName);
    await collection.insertOne({
      email,
      timestamp,
      inventoryData,
    });
  } catch (error: any) {
    return {
      message: "Saving DB Error Occured",
      sub_message: error.message,
    };
  }
  redirect(redirectPath);
}
