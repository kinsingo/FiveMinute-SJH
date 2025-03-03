import { auth } from "@/app/api/auth/next-auth";
import { signInServerAction } from "@/app/api/auth/components/auth-server-action";
import { ReactNode } from "react";

export default async function DatasetLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  if (!session) await signInServerAction();

  return <>{children}</>;
}
