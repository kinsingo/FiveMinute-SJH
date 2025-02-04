import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Card, Text, Button } from "react-native-paper";
import MyActivityIndicator from "@/components/MyActivityIndicator";
import { getInstructions, Instruction } from "@/components/todo/instruction-db-manager";

export default function InstructionListScreen() {
  const router = useRouter();
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await getInstructions();
    setInstructions(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <MyActivityIndicator />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={instructions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/todo/detail-instruction-page",
                params: {
                  id: item.id,
                  title: item.title,
                  author: item.author,
                  timestamp: item.timestamp,
                  details: item.details,
                  imageUrl: encodeURIComponent(item.imageUrl),
                },
              })
            }
          >
            <Card style={{ marginBottom: 12 }}>
              <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                  제목 : {item.title}
                </Text>
                <Text variant="titleSmall">
                  작성자 : {item.author}
                </Text>
                <Text variant="titleSmall">
                  작성시간 : {item.timestamp}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
      <Button
        mode="contained"
        onPress={() => router.push("/todo/new-instruction-page")}
        style={{ margin: 16 }}
      >
        새 지시사항 추가
      </Button>
    </View>
  );
}
