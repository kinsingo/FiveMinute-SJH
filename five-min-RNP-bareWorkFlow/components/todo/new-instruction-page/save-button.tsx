import React, { useState, useContext } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import {
  addInstruction,
  Instruction,
  LocationProp,
} from "@/components/todo/instruction-db-manager";
import { AuthContext } from "@/store/context/AuthContext";
import { getTimeStamp } from "@/util/time-manager";
import { uploadImageToFirebase } from "@/components/todo/instruction-storage-mananger";
import { PUSHTOKEN_URL } from "@/util/registerForPushNotificationsAsync";

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

      // ✅ 1. Next.js 백엔드에서 저장된 모든 토큰 가져오기
      const response = await fetch(PUSHTOKEN_URL);
      const tokens = await response.json(); // [{ token: "ExponentPushToken[xxx]" }, ...]

      if (tokens.length > 0) {
        // ✅ 2. 푸시 알림을 보낼 토큰 목록 준비
        const invalidTokens: string[] = [];

        //Promise.all을 사용하여 모든 푸시 알림 요청을 병렬로 보내기
        await Promise.all(
          tokens.map(async (tokenObj: any) => {
            try {
              const pushResponse = await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Accept-encoding": "gzip, deflate",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: tokenObj.token,
                  title: "새로운 지시사항이 등록되었습니다.",
                  body: `${newInstruction.title}`,
                  data: {
                    instruction: newInstruction,
                  },
                }),
              });

              const pushResult = await pushResponse.json();
              if (pushResult.data?.status === "error") {
                const errorType = pushResult.data?.details?.error || "UnknownError";
                if (errorType === "DeviceNotRegistered") {
                  console.warn(`⚠️ 장치가 등록 해제됨: ${tokenObj.token}`);
                  invalidTokens.push(tokenObj.token); // ✅ 장치가 없으면 삭제 목록에 추가
                } else {
                  console.warn(
                    `🚨 푸시 실패 (장치 문제 아님): ${tokenObj.token}, 이유: ${errorType}`
                  );
                }
              }
            } catch (error) {
              console.error(`❌ 푸시 알림 전송 실패: ${tokenObj.token}`, error);
            }
          })
        );

        // ✅ 3. 유효하지 않은 토큰 삭제 요청
        if (invalidTokens.length > 0) {
          await fetch(PUSHTOKEN_URL, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tokens: invalidTokens }),
          });
          console.log("✅ Invalid tokens deleted:", invalidTokens);
        }
      }
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
