import { EmailVerification } from "../components/emailVerification";

export async function POST(req: Request) {
  const isExistanceCheck = false;
  return await EmailVerification(req, isExistanceCheck);
}
