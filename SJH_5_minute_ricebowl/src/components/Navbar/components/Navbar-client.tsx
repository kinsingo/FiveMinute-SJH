"use client";
import {signInServerAction,signOutServerAction} from "@/app/api/auth/components/auth-server-action";
import MKBox from "@/MKcomponents/MKBox";
import DefaultNavbar from "./DefaultNavbar";
import routes from "@/routes/NavBarRoutes";
import { Session } from "next-auth";
import {MKButtonColorType} from "@/MKcomponents/MKButton";

interface NavbarClientProps {
  session: Session | null;
}

export interface NavBarActionType {
  label: string;
  color: MKButtonColorType;
  onClick: () => Promise<void>;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const action: NavBarActionType =
    session && session.user
      ? {
          label: `Logout : ${session.user.email} `,
          color: "secondary",
          onClick: async () => await signOutServerAction(),
        }
      : {
          label: "Login",
          color: "info",
          onClick: async () => await signInServerAction(),
        };

  return (
    <>
      <MKBox bgColor="white" shadow="sm" py={0.25}>
        <DefaultNavbar
          brand="오분 덮밥"
          action={action}
          routes={routes}
          transparent={true}
          relative={true}
          center={false}
        />
      </MKBox>
    </>
  );
}
