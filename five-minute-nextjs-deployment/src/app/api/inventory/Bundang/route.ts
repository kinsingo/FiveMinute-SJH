import GETModule from "../components/get";
import DeleteModule from "../components/delete";
import { NextRequest } from "next/server";
import POSTModule from "../components/post";
import {InventoryCollectionName} from "@/MongoDB/db-manager";

const collectionName = InventoryCollectionName.bundang;

export async function GET() {
  return await GETModule(collectionName);
}

export async function DELETE(req: NextRequest) {
  return await DeleteModule(collectionName, req);
}

export async function POST(req: NextRequest) {
  return await POSTModule(collectionName, req);
}
