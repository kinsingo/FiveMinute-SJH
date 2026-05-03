import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { AuthContext } from "@/store/context/AuthContext";
import LoginRequired from "@/components/LoginRequired";
import { LocationProp, koreanPlaceName } from "@/components/todo/instruction-db-manager";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  if (!auth.isLogin) {
    return <LoginRequired router={router} title="소통 보드" />;
  }
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "소통 보드" }} />
      {[
        { title: "강남점" as koreanPlaceName, place: "Gangnam" as LocationProp },
        { title: "수내점" as koreanPlaceName, place: "Bundang" as LocationProp },
      ].map(({ title, place }) => ToDoStacks({ title, place  }))}
    </Stack>
  );
}

function ToDoStacks({
  title,
  place,
}: {
  title: koreanPlaceName;
  place: LocationProp;
}) {
  return [
    <Stack.Screen key={`${place}-list`} name={`${place}/instruction-list`} options={{ title: `${title} - 소통 보드` }} />,
    <Stack.Screen key={`${place}-detail`} name={`${place}/detail-instruction`} options={{ title: `${title} - 소통 내용` }} />,
    <Stack.Screen key={`${place}-new`} name={`${place}/new-instruction`} options={{ title: `${title} - 소통 남기기` }} />,
  ];
}
