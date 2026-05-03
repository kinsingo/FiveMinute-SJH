import { NextRequest, NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";

export async function saveToken({
  req,
  COLLECTION_NAME,
}: {
  req: NextRequest;
  COLLECTION_NAME: string;
}) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const collection = await getPublicCollection(COLLECTION_NAME);

    //upsert: true를 사용하여 이미 존재하는 토큰이면 업데이트하고, 없으면 삽입하는 방식
    await collection.updateOne(
      { token },
      { $set: { token, createdAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json(
      { message: "Token stored successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error : " + error },
      { status: 500 }
    );
  }
}

export async function getTokens({
  COLLECTION_NAME,
}: {
  COLLECTION_NAME: string;
}) {
  try {
    const collection = await getPublicCollection(COLLECTION_NAME);
    const tokens = await collection.find().toArray();

    return NextResponse.json(tokens, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error : " + error },
      { status: 500 }
    );
  }
}

export async function deleteToken({
  req,
  COLLECTION_NAME,
}: {
  req: NextRequest;
  COLLECTION_NAME: string;
}) {
  try {
    const { tokens } = await req.json(); // 여러 개의 토큰을 배열로 받음
    if (!tokens || tokens.length === 0) {
      return NextResponse.json(
        { error: "No tokens provided" },
        { status: 400 }
      );
    }

    const collection = await getPublicCollection(COLLECTION_NAME);
    const result = await collection.deleteMany({ token: { $in: tokens } });

    return NextResponse.json(
      { message: `${result.deletedCount} tokens deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error deleting tokens:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
