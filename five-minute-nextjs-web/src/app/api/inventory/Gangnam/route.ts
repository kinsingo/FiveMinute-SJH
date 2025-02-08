import GETModule from "../components/get";
import DeleteModule from "../components/delete";
import POSTModule from "../components/post";
import { NextRequest } from "next/server";
import {InventoryCollectionName} from "@/MongoDB/db-manager";

const collectionName = InventoryCollectionName.gangnam;

export async function GET() {
  return await GETModule(collectionName);
}

export async function DELETE(req: NextRequest) {
  return await DeleteModule(collectionName, req);
}

export async function POST(req: NextRequest) {
  return await POSTModule(collectionName, req);
}
