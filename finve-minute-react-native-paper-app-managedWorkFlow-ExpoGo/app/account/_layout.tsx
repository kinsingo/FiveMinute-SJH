import { Stack, useRouter } from "expo-router";
import React, { useContext} from "react";
import { AuthContext } from "@/store/context/AuthContext";
import LoginRequired from "@/components/LoginRequired";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth.isLogin) {
     return <LoginRequired router={router} title="계정관리" />;
  }

  return <Stack
  screenOptions={{
    headerShown: false,
  }}
/>
}
