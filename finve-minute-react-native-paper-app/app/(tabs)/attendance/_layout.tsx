import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";

export default function Layout() {
  return (
    <>
      <SegmentedNavigation />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="main" options={{ title: "Main Page" }} />
        <Stack.Screen
          name="manage"
          options={{ title: "Attendance Management" }}
        />
        <Stack.Screen name="recent" options={{ title: "Recent Attendance" }} />
      </Stack>
    </>
  );
}

const SegmentedNavigation = () => {
  const router = useRouter(); // Hook for navigation
  const [value, setValue] = useState("main"); // Default to 'index'

  const handleNavigation = (val : string) => {
    setValue(val); // Update the selected value
    if (val === "main") {
      router.push("/(tabs)/attendance/main");
    } else if (val === "manage") {
      router.push("/(tabs)/attendance/manage");
    } else if (val === "recent") {
      router.push("/(tabs)/attendance/recent");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={(val) => {
            handleNavigation(val);
        }}
        buttons={[
          {
            value: "main",
            label: "main",
          },
          {
            value: "manage",
            label: "manage",
          },
          {
            value: "recent",
            label: "recent",
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      marginHorizontal: 30,
      marginVertical: 10,
    },
  });
