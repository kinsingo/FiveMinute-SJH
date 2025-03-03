import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Card, Text, Button } from "react-native-paper";
import MyActivityIndicator from "@/components/MyActivityIndicator";
import { getInstructions, Instruction,LocationProp } from "@/components/todo/instruction-db-manager";

export default function InstructionListModule({Location}:{Location:LocationProp}) {
  const router = useRouter();
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await getInstructions({Location});
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
                pathname: `/todo/${Location}/detail-instruction` as any,
                params: {
                  id: item.id,
                  title: item.title,
                  author: item.author,
                  email: item.email,
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
        onPress={() => router.push(`/todo/${Location}/new-instruction` as any)}
        style={{ margin: 16 }}
      >
        새 지시사항 추가
      </Button>
    </View>
  );
}
