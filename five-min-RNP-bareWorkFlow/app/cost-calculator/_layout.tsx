import LoginRequired from "@/components/LoginRequired";
import { AuthContext } from "@/store/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth.isLogin) {
    return <LoginRequired router={router} title="전화주문 가격계산기" />;
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "전화주문 가격계산기" }} />
      <Stack.Screen name="manage" options={{ title: "전화주문 메뉴 관리" }} />
    </Stack>
  );
}
