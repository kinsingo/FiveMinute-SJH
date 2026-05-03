import Dashboard from "./components/DashBoard";
import { auth } from "@/app/api/auth/next-auth";

export default async function Page() {
  const session = await auth();
  return <Dashboard login_email={session?.user?.email as string} />;
}
