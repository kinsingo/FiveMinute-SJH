import { UpdateAccount, GetAccountInfo } from "@/app/api/components/account";

const COLLECTION_NAME = "users";

export async function POST(req: Request) {
  return await UpdateAccount(req, COLLECTION_NAME);
}

export async function GET(req: Request) {
  return await GetAccountInfo(req, COLLECTION_NAME);
}
