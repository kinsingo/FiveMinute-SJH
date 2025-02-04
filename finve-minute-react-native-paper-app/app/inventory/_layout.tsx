import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/store/context/AuthContext";
import LoginRequired from "@/components/LoginRequired";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  if (!auth.isLogin) {
    return <LoginRequired router={router} title="재고 관리" />;
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "재고 관리" }} />
      <Stack.Screen name="Gangnam/update" options={{ title: "강남점 - 재고 업데이트" }} />
      <Stack.Screen name="Gangnam/status" options={{ title: "강남점 - 재고 상태" }} />
      <Stack.Screen name="Bundang/update" options={{ title: "수내점 - 재고 업데이트" }} />
      <Stack.Screen name="Bundang/status" options={{ title: "수내점 - 재고 상태" }} />
    </Stack>
  );
}
