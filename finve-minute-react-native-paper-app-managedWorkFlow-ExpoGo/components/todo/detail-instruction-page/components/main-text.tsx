import React from "react";
import { Text } from "react-native-paper";

interface InstructionDetailScreenProps {
  title: string;
  author: string;
  timestamp: string;
}

export default function MainText({ title, author, timestamp }: InstructionDetailScreenProps) {
  return (
    <>
      <Text variant="titleLarge" style={{ fontWeight: "bold" }}>
        {title}
      </Text>
      <Text variant="bodySmall" style={{ color: "gray", marginVertical: 4 }}>
        {author} {timestamp}
      </Text>
    </>
  );
}
