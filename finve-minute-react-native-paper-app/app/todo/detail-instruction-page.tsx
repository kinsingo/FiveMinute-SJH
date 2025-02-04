import React, { useState, useEffect,useContext } from "react";
import { View, ScrollView, StyleSheet, Keyboard } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, Card, Avatar, TextInput, Button, useTheme } from "react-native-paper";
import EditableButtons from "@/components/todo/detail-instruction-page/editable-buttons";
import TodoDetailCard from "@/components/todo/detail-instruction-page/todo-detail-card";
import { getTimeStamp } from "@/util/time-manager";
import { AuthContext } from "@/store/context/AuthContext";
import { db } from "@/firebase/services";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";

interface CommentProps {
  id?: string;
  content: string;
  author: string;
  timestamp: string;
}

export default function InstructionDetailScreen() {
  const {
    id,
    title,
    author,
    timestamp,
    details: initialDetails,
    imageUrl,
  } = useLocalSearchParams();
  const [details, setDetails] = useState<string>(initialDetails as string);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<string>(""); // 현재 입력 중인 댓글
  const [comments, setComments] = useState<CommentProps[]>([]); // 댓글 리스트
  const theme = useTheme();
  const auth = useContext(AuthContext);

  // 🔹 Firestore에서 댓글 데이터 불러오기 (실시간 업데이트)
  useEffect(() => {
    if (!id) return;
    const commentsRef = collection(db, "instructions", id as string, "comments");
    const q = query(commentsRef, orderBy("timestamp", "desc")); // 최신 댓글이 위로 오도록 정렬

    //irestore의 onSnapshot은 실시간 데이터 리스너 역할을 합니다(irestore에서 데이터가 변경될 때마다 자동으로 UI를 업데이트)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedComments: CommentProps[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CommentProps[];
      setComments(loadedComments);
    });
    return () => unsubscribe(); // Cleanup (컴포넌트가 언마운트될 때 리스너 해제)
  }, [id]);

  // 댓글 추가 함수
  const handleAddComment = async () => {
    if (content.trim() === "" || !id) return;

    const newComment: CommentProps = {
      content: content,
      author: auth.user?.email as string,
      timestamp: getTimeStamp(),
    };

    try {
      const commentsRef = collection(db, "instructions", id as string, "comments");
      await addDoc(commentsRef, newComment);
      setContent(""); // 입력 필드 초기화
      Keyboard.dismiss(); // 키보드 닫기
    } catch (error) {
      console.error("댓글 추가 실패:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", alignContent: "center" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <EditableButtons
          id={id as string}
          details={details}
          imageUrl={imageUrl as string}
          author={author as string}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setDetails={setDetails}
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

        {/* 댓글 리스트 표시 */}
        {comments.map((comment, index) => (
          <Card
            key={index}
            style={{ marginTop: 10, backgroundColor: theme.colors.background }}
            mode="outlined"
          >
            <Card.Content>
              <Text variant="bodyMedium">{comment.content}</Text>
              <Text variant="bodySmall" style={{ color: "gray", marginVertical: 4 }}>
                {comment.author} {comment.timestamp}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <View style={styles.commentInputContainer}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="댓글을 입력하세요..."
          mode="outlined"
          style={styles.commentInput}
          dense
        />
        <Button mode="text" onPress={handleAddComment}>
          <Avatar.Icon icon="send" size={40} />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
