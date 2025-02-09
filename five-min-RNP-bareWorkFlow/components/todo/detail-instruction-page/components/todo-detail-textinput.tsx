import React from "react";
import { ScrollView } from "react-native";
import { Text, TextInput } from "react-native-paper";
import ThemeModeContext from "@/store/context/ThemeModeContext";
interface InstructionDetailScreenProps {
  isEditing: boolean;
  details: string;
  setDetails: (details: string) => void;
}

export default function DetailTextInput({
  isEditing,
  details,
  setDetails,
}: InstructionDetailScreenProps) {
  const { isThemeDark } = React.useContext(ThemeModeContext);

  return (
    <ScrollView
      style={{ maxHeight: 150 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={true}
      indicatorStyle={isThemeDark ? "white" : "black"}
    >
      {isEditing ? (
        <TextInput
          label="세부사항"
          value={details}
          onChangeText={setDetails}
          mode="outlined"
          multiline
          numberOfLines={7} // ✅ Android에서 기본 적용됨 (필수임)
          style={{ marginBottom: 10 }}
          placeholder="세부사항을 입력하세요."
          autoCorrect={false} // ✅ 자동 수정(자동완성) 방지
          autoCapitalize="none" // ✅ 자동 대문자 변환 방지
        />
      ) : (
        <Text variant="bodyMedium">{details}</Text>
      )}
    </ScrollView>
  );
}
