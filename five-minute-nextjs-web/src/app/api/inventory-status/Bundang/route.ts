import GETModule from "../components/get";

const collectionName = "inventory-status-bundang";

export async function GET() {
  return await GETModule(collectionName);
}

