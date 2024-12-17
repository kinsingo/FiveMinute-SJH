"use client";
import {
  signInServerAction,
  signOutServerAction,
} from "@/app/api/auth/components/auth-server-action";
import MKBox from "@/MKcomponents/MKBox";
import DefaultNavbar from "./DefaultNavbar";
import routes from "@/routes/NavBarRoutes";
import { Session } from "next-auth";
import { MKButtonColorType } from "@/MKcomponents/MKButton";
import breakpoints from "../../../theme/base/breakpoints";
import { useState, useEffect } from "react";

interface NavbarClientProps {
  session: Session | null;
}

export interface NavBarActionType {
  label: string;
  color: MKButtonColorType;
  onClick: () => Promise<void>;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    // Set the initial label based on the window width
    const updateLabel = () => {
      if (session && session.user) {
        setLabel(
          window.innerWidth < breakpoints.values.sm
            ? "Logout"
            : `Logout : ${session.user.email}`
        );
      } else {
        setLabel("Login");
      }
    };

    updateLabel(); // Set label on initial render
    window.addEventListener("resize", updateLabel); // Update label on resize

    return () => {
      window.removeEventListener("resize", updateLabel); // Cleanup event listener
    };
  }, [session]);

  const action: NavBarActionType = {
    label,
    color: session && session.user ? "secondary" : "info",
    onClick: async () =>
      session && session.user
        ? await signOutServerAction()
        : await signInServerAction(),
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
