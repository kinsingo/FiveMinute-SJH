import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="stackPage1"
        options={{ title: "Stack Page 1" }}
      />
      <Stack.Screen
        name="stackPage2"
        options={{ title: "Stack Page 2" }}
      />
      <Stack.Screen
        name="stackPage3"
        options={{ title: "Stack Page 3" }}
      />
    </Stack>
  );
}
