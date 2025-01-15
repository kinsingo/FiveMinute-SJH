import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#f5f5f5" } }}>
      <Stack.Screen
        name="stackPage1"
        options={{
          title: "Stack Page 1",
        }}
      />
      <Stack.Screen
        name="stackPage2"
        options={{
          title: "Stack Page 2",
          headerStyle: { backgroundColor: "blue" },
          headerTintColor: "red",
          contentStyle: { backgroundColor: "yellow" },
        }}
      />
      <Stack.Screen name="stackPage3" options={{ title: "Stack Page 3" }} />
    </Stack>
  );
}
