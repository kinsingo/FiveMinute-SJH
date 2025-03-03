import React, { useState, useContext } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { addInstruction, Instruction,LocationProp } from "@/components/todo/instruction-db-manager";
import { AuthContext } from "@/store/context/AuthContext";
import { getTimeStamp } from "@/util/time-manager";
import { uploadImageToFirebase } from "@/components/todo/instruction-storage-mananger";

export default function SaveButton({
  title,
  details,
  imageUrl,
  IsSaving,
  setIsSaving,
  Location,
}: {
  title: string;
  details: string;
  imageUrl: string | null;
  IsSaving: boolean;
  setIsSaving: (value: boolean) => void;
  Location: LocationProp;
}) {
  const router = useRouter();
  const auth = useContext(AuthContext);

  // Firestore에 데이터 추가하는 함수
  const handleSaveInstruction = async () => {
    if (!title) {
      Alert.alert("업로드 실패", "제목은 필수로 입력 하셔야 합니다.");
      return;
    }
    setIsSaving(true); // ✅ 저장 시작 (로딩 상태)
    try {
      let firebaseImageUrl = imageUrl;
      if (imageUrl) {
        firebaseImageUrl = await uploadImageToFirebase(imageUrl);
        if (!firebaseImageUrl) {
          Alert.alert("업로드 실패", "이미지 업로드 중 오류가 발생했습니다.");
          setIsSaving(false); // ✅ 저장 실패 시 상태 해제
          return;
        }
      }
      const newInstruction = {
        title,
        author: auth.userInfo?.nickname || auth.userInfo?.realname || auth.user?.email,
        email: auth.user?.email,
        timestamp: getTimeStamp(),
        details,
        imageUrl: firebaseImageUrl || "",
      };
      await addInstruction({ Location, instruction: newInstruction as Instruction });
      router.back(); // 저장 후 목록 화면으로 이동
    } catch (error) {
      Alert.alert("저장 실패", "지시사항 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false); // ✅ 저장 완료 시 상태 해제
    }
  };

  return (
    <Button
      mode="contained"
      onPress={handleSaveInstruction}
      style={{ marginTop: 16 }}
      disabled={IsSaving}
    >
      {IsSaving ? "저장중.." : "지시사항 저장하기"}
    </Button>
  );
}
