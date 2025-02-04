import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/store/context/AuthContext";
import LoginRequired from "@/components/LoginRequired";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  if (!auth.isLogin) {
    return <LoginRequired router={router} title="지시사항" />;
  }
  
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "지시사항" }} />
      <Stack.Screen name="detail-instruction-page" options={{ title: "지시사항 상세" }} />
      <Stack.Screen name="new-instruction-page" options={{ title: "지시사항 작성" }} />
    </Stack>
  );
}
