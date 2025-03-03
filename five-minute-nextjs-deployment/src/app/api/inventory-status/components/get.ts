import { NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";

export default async function GETModule(collectionName:string) {
  try {
    const collection = await getPublicCollection(collectionName);

    // MongoDB 데이터를 가져옴
    const latestDocuments = await collection
      .find({})
      .sort({ timestamp: -1 }) // 최신 데이터 정렬
      .limit(3)
      .toArray();

    // _id를 문자열로 변환 (ObjectId -> string)
    const sanitizedDocuments = latestDocuments.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json(sanitizedDocuments);
  } catch (error) {
    console.error("Error fetching public collection:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
