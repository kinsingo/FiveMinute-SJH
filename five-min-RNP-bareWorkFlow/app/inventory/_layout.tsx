import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/store/context/AuthContext";
import LoginRequired from "@/components/LoginRequired";
import { LocationProp, koreanPlaceName } from "@/components/todo/instruction-db-manager";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();
  if (!auth.isLogin) {
    return <LoginRequired router={router} title="재고 관리" />;
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "재고 관리" }} />
      {[
        { title: "강남점" as koreanPlaceName, place: "Gangnam" as LocationProp },
        { title: "수내점" as koreanPlaceName, place: "Bundang" as LocationProp },
        { title: "관악점" as koreanPlaceName, place: "Sinlim" as LocationProp },
      ].map(({ title, place }) => InventoryStacks({ title, place }))}
    </Stack>
  );
}

function InventoryStacks({
  title,
  place,
}: {
  title: koreanPlaceName;
  place: LocationProp;
}) {
  return [
    <Stack.Screen key={`${place}-update`} name={`${place}/update`} options={{ title: `${title} - 재고 업데이트` }} />,
    <Stack.Screen key={`${place}-status`} name={`${place}/status`} options={{ title: `${title} - 재고 상태` }} />,
  ];
}