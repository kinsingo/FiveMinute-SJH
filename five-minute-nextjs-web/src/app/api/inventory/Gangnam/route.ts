import GETModule from "../components/get";
import DeleteModule from "../components/deletePost";
import { NextRequest } from "next/server";

const collectionName = "inventory-status-gangnam";

export async function GET() {
  return await GETModule(collectionName);
}

export async function POST(req: NextRequest) {
  return await DeleteModule(collectionName, req);
}
