import { NextResponse, NextRequest } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";

export default async function POSTModule(
  collectionName: string,
  req: NextRequest,
) {
  try {
    const collection = await getPublicCollection(collectionName);
    const { email, nickname, realname, timestamp, inventoryData } =
      await req.json();
    await collection.insertOne({
      email,
      nickname,
      realname,
      timestamp,
      inventoryData,
    });

    const expiredDocuments = await collection
      .find({}, { projection: { _id: 1 } })
      .sort({ _id: -1 })
      .skip(100)
      .toArray();

    if (expiredDocuments.length > 0) {
      await collection.deleteMany({
        _id: {
          $in: expiredDocuments.map((document) => document._id),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "데이터 저장 성공",
    });
  } catch (error) {
    console.error("Error saving data:", error); //error handling is necessary for Typescript
    return NextResponse.json({
      success: false,
      message: "데이터 저장 실패",
    });
  }
}
