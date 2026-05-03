import LoginRequired from "@/components/LoginRequired";
import { AuthContext } from "@/store/context/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useContext } from "react";
import {
  CalendarKoreanPlaceName,
  CalendarLocationProp,
} from "@/features/calendar/types";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth.isLogin) {
    return <LoginRequired router={router} title="공유 캘린더" />;
  }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "공유 캘린더" }} />
      {[
        { title: "강남점" as CalendarKoreanPlaceName, place: "Gangnam" as CalendarLocationProp },
        { title: "수내점" as CalendarKoreanPlaceName, place: "Bundang" as CalendarLocationProp },
      ].map(({ title, place }) => CalendarStacks({ title, place }))}
    </Stack>
  );
}

function CalendarStacks({
  title,
  place,
}: {
  title: CalendarKoreanPlaceName;
  place: CalendarLocationProp;
}) {
  return (
    <Stack.Screen
      key={`${place}-index`}
      name={`${place}/index`}
      options={{ title: `${title} - 공유 캘린더` }}
    />
  );
}
