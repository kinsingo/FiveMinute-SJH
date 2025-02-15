import { Stack, useRouter } from "expo-router";
import React, { useState, useContext} from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { AuthContext } from "@/store/context/AuthContext";
import LoginRequired from "@/components/LoginRequired";

export default function Layout() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  if (!auth.isLogin) {
     return <LoginRequired router={router} title="근태 관리" />;
  }

  return (
    <>
      <SegmentedNavigation />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="main" options={{ title: "Main Page" }} />
        <Stack.Screen name="manage" options={{ title: "Attendance Management" }} />
        <Stack.Screen name="recent" options={{ title: "Recent Attendance" }} />
      </Stack>
    </>
  );
}

const SegmentedNavigation = () => {
  const router = useRouter(); // Hook for navigation
  const [value, setValue] = useState("main"); // Default to 'index'

  const handleNavigation = (val: string) => {
    setValue(val); // Update the selected value
    if (val === "main") {
      router.push("/attendance/main");
    } else if (val === "manage") {
      router.push("/attendance/manage");
    } else if (val === "recent") {
      router.push("/attendance/recent");
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
            value: "manage",
            label: "출/퇴근",
          },
          {
            value: "main",
            label: "자세히",
          },
          {
            value: "recent",
            label: "요약",
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
