import { NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";

export async function GET() {
  try {
    const usersCollection = await getPublicCollection("users");
    const users = await usersCollection.find().toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to fetch data:${error}` },
      { status: 500 }
    );
  }
}
