import { Stack } from 'expo-router';
import { useRouter } from "expo-router";
import { IsLogin } from "@/components/login/auth";
import { useFocusEffect } from "@react-navigation/native"; 
import { useCallback } from "react";

export default function Layout() {
   const router = useRouter(); 
   useFocusEffect(
    useCallback(() => {
      const checkLogin = async () => {
        const isLogin = await IsLogin();
        if (!isLogin.success) {
          router.replace("/(tabs)/authentication/login"); 
        }
      };
      checkLogin();
    }, [])
  );

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: '재고 관리' }} />
      <Stack.Screen name="Gangnam/update" options={{ title: '강남점 - 재고 업데이트' }} />
      <Stack.Screen name="Gangnam/status" options={{ title: '강남점 - 재고 상태' }} />
      <Stack.Screen name="Bundang/update" options={{ title: '수내점 - 재고 업데이트' }} />
      <Stack.Screen name="Bundang/status" options={{ title: '수내점 - 재고 상태' }} />
    </Stack>
  );
}
