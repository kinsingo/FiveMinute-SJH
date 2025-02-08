import { useRouter } from "expo-router";
import { List } from "react-native-paper";
import React from "react";

export default function Todo() {
  const router = useRouter();
  return (
    <List.Section>
      <List.Item title="강남점" onPress={() => router.push("/todo/Gangnam/instruction-list")} />
      <List.Item title="수내점" onPress={() => router.push("/todo/Bundang/instruction-list")} />
      <List.Item title="관악점" onPress={() => router.push("/todo/Sinlim/instruction-list")} />
    </List.Section>
  );
}
