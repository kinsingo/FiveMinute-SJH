import React, { useContext } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import {
  updateInstruction,
  deleteInstruction,
  deleteInstructionComment,
  CommentProps,
  LocationProp,
} from "@/components/todo/instruction-db-manager";
import { deleteImageFromFirebase } from "@/components/todo/instruction-storage-mananger";
import { AuthContext } from "@/store/context/AuthContext";

export default function EditableButtons({
  id,
  details,
  imageUrl,
  author,
  email,
  isEditing,
  setIsEditing,
  setDetails,
  Location,
  disabled,
  comments,
}: {
  id: string | null;
  details: string;
  imageUrl: string | null;
  author: string;
  email: string;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  setDetails: (details: string) => void;
  Location: LocationProp;
  disabled: boolean;
  comments: CommentProps[];
}) {
  const router = useRouter();
  const auth = useContext(AuthContext);
  const IsValidUser = auth.user?.isAdmin || auth.user?.email === email;

  // Firestore에 수정된 데이터 업데이트
  const handleUpdateInstruction = async () => {
    if (!id) {
      Alert.alert("지시사항 ID가 없습니다.");
      return;
    }
    await updateInstruction({
      id: id as string,
      Location: Location,
      details: details,
    });
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
          try {
            // 1️⃣ 댓글 이미지 삭제
            await Promise.all(
              comments.map(async (comment) => {
                if (comment.commentImageUrl) {
                  await deleteImageFromFirebase(comment.commentImageUrl);
                }
              })
            );

            // 2️⃣ 댓글 문서 삭제
            await Promise.all(
              comments.map(async (comment) =>
                deleteInstructionComment({
                  instructionId: id as string,
                  commentId: comment.id,
                  Location,
                })
              )
            );

            // 3️⃣ 지시사항 이미지 삭제
            if (imageUrl) {
              await deleteImageFromFirebase(imageUrl as string);
            }

            // 4️⃣ 지시사항 문서 삭제
            await deleteInstruction({ id: id as string, Location });

            // 5️⃣ 삭제 완료 후 뒤로 이동
            router.back();
          } catch (error) {
            console.error("🔥 삭제 중 오류 발생:", error);
            Alert.alert("삭제 실패", "지시사항 삭제 중 오류가 발생했습니다.");
          }
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
            <Button mode="contained" onPress={() => setDetails("")} disabled={disabled}>
              세부사항 비우기
            </Button>
            <Button mode="outlined" onPress={handleUpdateInstruction} disabled={disabled}>
              수정 완료
            </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => setIsEditing(true)} disabled={disabled}>
              세부사항 수정하기
            </Button>
            <Button mode="outlined" onPress={handleDeleteInstruction} disabled={disabled}>
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
