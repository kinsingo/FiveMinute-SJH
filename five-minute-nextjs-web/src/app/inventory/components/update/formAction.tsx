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
  if (!session) 
    await signInServerAction();
  if(!session || !session.user || !session.user.email)
    return { message: "No User Email" }; 

  const email = session.user.email as string;
  //const timestamp = new Date().toISOString(); // ISO 형식의 날짜/시간
  const timestamp = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Seoul',
  }).format(new Date());
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
