import GETModule from "../components/get";
import {InventoryCollectionName} from "@/MongoDB/db-manager";

export async function GET() {
  return await GETModule(InventoryCollectionName.bundang);
}

