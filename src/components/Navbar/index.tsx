// Routes
import {auth } from "@/app/api/auth/next-auth";
import NavbarClient from "./components/Navbar-client";
export default async function BMTNavbar() {
  const session = await auth();
  if (session && session.user) 
    session.user = { email: session.user.email };
  return  <NavbarClient session={session} />
}