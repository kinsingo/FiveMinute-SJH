import { AuthContext } from "@/store/context/AuthContext";
import { useContext } from "react";
import { CalendarUser } from "../types";

export function useCalendarCurrentUser(): CalendarUser | null {
  const { user, userInfo } = useContext(AuthContext);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: userInfo?.realname || userInfo?.nickname || user.email,
    role: user.isAdmin ? "admin" : "staff",
    position: userInfo?.position,
  };
}
