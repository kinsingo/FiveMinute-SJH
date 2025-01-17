import { Stack } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Layout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: "#f5f5f5" } }}>
      <Stack.Screen name="index" options={{ title: 'Inventory Management' }} />
      <Stack.Screen name="Gangnam/update" options={{ title: '강남점 - 재고 업데이트' }} />
      <Stack.Screen name="Gangnam/status" options={{ title: '강남점 - 재고 상태' }} />
      <Stack.Screen name="Bundang/update" options={{ title: '수내점 - 재고 업데이트' }} />
      <Stack.Screen name="Bundang/status" options={{ title: '수내점 - 재고 상태' }} />
    </Stack>
  );
}
