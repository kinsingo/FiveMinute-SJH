import { UpdateAccount, GetAccountInfo } from "@/app/api/components/account";
import { USERS_COLLECTION_NAME } from "../kitchen-sense-collection";

export async function POST(req: Request) {
  return await UpdateAccount(req, USERS_COLLECTION_NAME);
}

export async function GET(req: Request) {
  return await GetAccountInfo(req, USERS_COLLECTION_NAME);
}
