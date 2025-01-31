import GETModule from "../components/get";
const collectionName = "inventory-status-gangnam";

export async function GET() {
  return await GETModule(collectionName);
}
