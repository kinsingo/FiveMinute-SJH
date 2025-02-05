import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
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

      <Stack.Screen name="Gangnam/instruction-list" options={{ title: "강남점 - 지시사항" }} />
      <Stack.Screen name="Gangnam/detail-instruction" options={{ title: "강남점 - 상세 지시사항" }} />
      <Stack.Screen name="Gangnam/new-instruction" options={{ title: "강남점 - 지시사항 추가" }} />

      <Stack.Screen name="Bundang/instruction-list" options={{ title: "수내점 - 지시사항" }} />
      <Stack.Screen name="Bundang/detail-instruction" options={{ title: "수내점 - 상세 지시사항" }} />
      <Stack.Screen name="Bundang/new-instruction" options={{ title: "수내점 - 지시사항 추가" }} /> 
    </Stack>
  );
}
