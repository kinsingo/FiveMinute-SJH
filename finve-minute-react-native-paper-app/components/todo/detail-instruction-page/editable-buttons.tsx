import React, { useContext } from "react";
import { View, Alert, StyleSheet } from "react-native";
import {  Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { updateInstruction, deleteInstruction } from "@/components/todo/instruction-db-manager";
import { deleteImageFromFirebase } from "@/components/todo/instruction-storage-mananger";
import { AuthContext } from "@/store/context/AuthContext";

export default function EditableButtons({
  id,
  details,
  imageUrl,
  author,
  isEditing,
  setIsEditing,
  setDetails,
}: {
  id: string | null;
  details: string;
  imageUrl: string | null;
  author: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setDetails: (details: string) => void;
}) {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const IsValidUser = auth.user?.email === author;

  // Firestore에 수정된 데이터 업데이트
  const handleUpdateInstruction = async () => {
    if (!id) {
      Alert.alert("지시사항 ID가 없습니다.");
      return;
    }
    await updateInstruction(id as string, details);
    setIsEditing(false);
  };

  const handleDeleteInstruction = async () => {
    if (!id) {
      Alert.alert("지시사항 ID가 없습니다.");
      return;
    }

    Alert.alert("삭제 확인", "정말 이 지시사항을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteInstruction(id as string);
          await deleteImageFromFirebase(imageUrl as string);
          router.back(); // 목록 화면으로 이동
        },
      },
    ]);
  };

  return (
    <>
      {/* 수정 버튼 */}
      {IsValidUser &&
        (isEditing ? (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => setDetails("")}>
              세부사항 비우기
            </Button>
            <Button mode="outlined" onPress={handleUpdateInstruction}>
              수정 완료
            </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => setIsEditing(true)}>
              세부사항 수정하기
            </Button>
            <Button mode="outlined" onPress={handleDeleteInstruction}>
              지시사항 삭제하기
            </Button>
          </View>
        ))}
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 16,
  },
});
