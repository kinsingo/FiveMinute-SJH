import React from "react";
import { View, Image } from "react-native";
import { useTheme } from "react-native-paper";

export default function ToDoImage({ imageUrl }: { imageUrl: string }) {
  const theme = useTheme();
  return (
    <>
      {imageUrl && (
        <View
          style={{
            width: "100%",
            height: 250,
            borderRadius: 8,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.colors.secondaryContainer,
          }}
        >
          <Image
            source={{ uri: imageUrl as string }}
            style={{
              width: "100%", // ✅ 이미지 크기 지정
              height: "100%", // ✅ 이미지 크기 지정
              borderRadius: 8,
            }}
            resizeMode="stretch"
          />
        </View>
      )}
    </>
  );
}
