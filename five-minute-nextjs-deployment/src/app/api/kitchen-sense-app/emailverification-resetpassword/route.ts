import { EmailVerification } from "../components/emailVerification";

export async function POST(req: Request) {
  const isExistanceCheck = true;
  return await EmailVerification(req, isExistanceCheck);
}
