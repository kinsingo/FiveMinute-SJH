import { NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";

export default async function GETModule(collectionName: string) {
  try {
    const collection = await getPublicCollection(collectionName);

    // 가장 최신 데이터 가져오기
    const latestDocument = await collection
      .find({})
      .sort({ timestamp: -1 }) // timestamp 기준 내림차순 정렬
      .limit(1) // 3 개의 문서만 가져오기
      .toArray();

    if (!latestDocument || !latestDocument[0])
      return NextResponse.json({ message: "이전 데이터가 없습니다" }, { status: 500 });

    const previousDocument = latestDocument[0];
    return NextResponse.json(previousDocument.inventoryData, { status: 200 });
  } catch (error) {
    console.error("Error fetching previous data:", error);
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
