import React from "react";
import { View, Image, Text } from "react-native";
import { Card, TextInput, useTheme } from "react-native-paper";
import ImageUploadButtons from "@/components/todo/new-instruction-page/image-upload-buttons";

interface NewInstructionScreenProps {
  title: string;
  details: string;
  imageUrl: string | null;
  IsSaving: boolean;
  setTitle: (title: string) => void;
  setDetails: (details: string) => void;
  setImageUrl: (url: string | null) => void;
}

export default function EditableCard({
  title,
  details,
  imageUrl,
  IsSaving,
  setTitle,
  setDetails,
  setImageUrl,
}: NewInstructionScreenProps) {
  const theme = useTheme();

  return (
    <Card>
      <Card.Content>
        <TextInput
          label="주제"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={{ marginBottom: 10 }}
          placeholder="주제를 입력하세요."
          disabled={IsSaving}
        />
        <TextInput
          label="내용"
          value={details}
          onChangeText={setDetails}
          mode="outlined"
          multiline
          numberOfLines={7}
          style={{ marginBottom: 10 }}
          placeholder="내용을 입력하세요."
          disabled={IsSaving}
        />
        <View
          style={{
            width: "100%",
            height: 150,
            borderRadius: 8,
            marginTop: 10,
            backgroundColor: theme.colors.secondaryContainer,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: "100%", // ✅ 이미지 크기 지정
                height: "100%", // ✅ 이미지 크기 지정
                borderRadius: 8,
              }}
              resizeMode="stretch"
            />
          ) : (
            <Text>필요하면 이미지를 함께 올려주세요</Text>
          )}
        </View>
        <ImageUploadButtons setImageUrl={setImageUrl} IsSaving={IsSaving} />
      </Card.Content>
    </Card>
  );
}
