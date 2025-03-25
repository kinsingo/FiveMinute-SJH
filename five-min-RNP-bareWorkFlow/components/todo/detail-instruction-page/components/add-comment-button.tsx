import React, { useContext } from "react";
import {  Keyboard, Alert } from "react-native";

import { Avatar, Button } from "react-native-paper";
import { getTimeStamp } from "@/util/time-manager";
import { AuthContext } from "@/store/context/AuthContext";
import {
  addInstructionComments,
  CommentProps,
  LocationProp,
} from "@/components/todo/instruction-db-manager";
import { uploadImageToFirebase } from "@/components/todo/instruction-storage-mananger";

export interface AddCommentButtonProps {
  id: string;
  content: string;
  setIsSaving: (isSaving: boolean) => void;
  IsSaving: boolean;
  commentImageUrl: string | null;
  setContent: (content: string) => void;
  setCommentImageUrl: (url: string | null) => void;
  Location: LocationProp;
}

export default function AddCommentButton({
  id,
  content,
  setIsSaving,
  IsSaving,
  commentImageUrl,
  setContent,
  setCommentImageUrl,
  Location,
}: AddCommentButtonProps) {
  const auth = useContext(AuthContext);

  const handleAddComment = async () => {
    if (content.trim() === "" || !id) return;

    setIsSaving(true);
    try {
      let firebaseImageUrl = commentImageUrl;
      if (commentImageUrl) {
        firebaseImageUrl = await uploadImageToFirebase(commentImageUrl);
        if (!firebaseImageUrl) {
          Alert.alert("업로드 실패", "이미지 업로드 중 오류가 발생했습니다.");
          setIsSaving(false); // ✅ 저장 실패 시 상태 해제
          return;
        }
      }

      const newComment = {
        content: content,
        author: auth.userInfo?.nickname || auth.userInfo?.realname || auth.user?.email as string,
        email: auth.user?.email as string,
        timestamp: getTimeStamp(),
        realTime: new Date().toISOString(),
        commentImageUrl: firebaseImageUrl || "",
      } as CommentProps;
      await addInstructionComments({
        id: id as string,
        Location,
        newComment,
      });
      setContent(""); // 입력 필드 초기화
      setCommentImageUrl(null); // 이미
      Keyboard.dismiss(); // 키보드 닫기
    } catch (error) {
      console.error("댓글 추가 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button mode="text" onPress={handleAddComment} disabled={IsSaving}>
      <Avatar.Icon icon="send" size={40} />
    </Button>
  );
}
