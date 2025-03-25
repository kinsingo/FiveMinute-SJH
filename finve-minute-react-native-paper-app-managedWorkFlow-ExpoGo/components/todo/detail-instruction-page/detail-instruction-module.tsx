import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import EditableButtons from "@/components/todo/detail-instruction-page/editable-buttons";
import TodoDetailCard from "@/components/todo/detail-instruction-page/todo-detail-card";
import { onSnapshot } from "firebase/firestore";
import {
  getInstructionCommentsQuery,
  CommentProps,
  LocationProp,
} from "@/components/todo/instruction-db-manager";
import ToDoDetailCommentImage from "@/components/todo/detail-instruction-page/components/todo-detail-comment-image";
import CommentInputModule from "@/components/todo/detail-instruction-page/components/comment-input-module";
import CommentCard from "@/components/todo/detail-instruction-page/components/comment-card";
import { MyVerticalScrollView } from "@/components/MyScrollView";

export default function DetailInstructionModule({ Location }: { Location: LocationProp }) {
  const {
    id,
    title,
    author,
    email,
    timestamp,
    details: initialDetails,
    imageUrl,
  } = useLocalSearchParams();
  const [details, setDetails] = useState<string>(initialDetails as string);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<string>(""); // 현재 입력 중인 댓글
  const [commentImageUrl, setCommentImageUrl] = useState<string | null>(null); // 댓글 이미지 상태 추가
  const [comments, setComments] = useState<CommentProps[]>([]); // 댓글 리스트
  const [IsSaving, setIsSaving] = useState(false);

  // 🔹 Firestore에서 댓글 데이터 불러오기 (실시간 업데이트)
  useEffect(() => {
    if (!id) return;
    //irestore의 onSnapshot은 실시간 데이터 리스너 역할을 합니다(irestore에서 데이터가 변경될 때마다 자동으로 UI를 업데이트)
    const query = getInstructionCommentsQuery({
      id: id as string,
      Location,
    });
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const loadedComments: CommentProps[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CommentProps[];
      setComments(loadedComments);
    });
    return () => unsubscribe(); // Cleanup (컴포넌트가 언마운트될 때 리스너 해제)
  }, [id]);

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", alignContent: "center" }}>
      <MyVerticalScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <EditableButtons
          id={id as string}
          details={details}
          imageUrl={imageUrl as string}
          author={author as string}
          email={email as string}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setDetails={setDetails}
          Location={Location}
          disabled={IsSaving}
          comments={comments}
        />
        <TodoDetailCard
          isEditing={isEditing}
          details={details}
          setDetails={setDetails}
          title={title as string}
          author={author as string}
          timestamp={timestamp as string}
          imageUrl={imageUrl as string}
        />
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </MyVerticalScrollView>

      {commentImageUrl && <ToDoDetailCommentImage commentImageUrl={commentImageUrl} />}
      <CommentInputModule
        id={id as string}
        content={content}
        setIsSaving={setIsSaving}
        IsSaving={IsSaving}
        commentImageUrl={commentImageUrl}
        setContent={setContent}
        setCommentImageUrl={setCommentImageUrl}
        Location={Location}
      />
    </View>
  );
}
