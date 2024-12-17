import { NextRequest, NextResponse } from "next/server";
import { getPublicCollection } from "@/MongoDB/db-manager";
import { ObjectId } from "mongodb";

export default async function DeleteModule(
  collectionName: string,
  req: NextRequest
) {
  try {
    const { id } = await req.json();

    console.log("Deleting document with id:", id);

    // MongoDB Collection 가져오기
    const collection = await getPublicCollection(collectionName);

    // 문자열을 ObjectId로 변환
    const objectId = new ObjectId(id);

    console.log("Deleting document with objectId:", objectId);

    // ObjectId로 변환 후 삭제
    const result = await collection.deleteOne({ _id: objectId });
    console.log("result:", result);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Document not found or already deleted" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Document deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting document:", err);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
