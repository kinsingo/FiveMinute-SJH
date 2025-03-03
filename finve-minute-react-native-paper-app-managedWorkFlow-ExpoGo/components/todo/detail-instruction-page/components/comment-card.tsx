import React, { useContext } from "react";
import { Text, Card, useTheme } from "react-native-paper";
import { CommentProps } from "@/components/todo/instruction-db-manager";
import ToDoDetailCommentImage from "@/components/todo/detail-instruction-page/components/todo-detail-comment-image";
import { AuthContext } from "@/store/context/AuthContext";
import { View, StyleSheet } from "react-native";

export default function CommentCard({ comment }: { comment: CommentProps }) {
  const theme = useTheme();
  const auth = useContext(AuthContext);
  const isAuthor = auth.user?.email === comment.email;

  //@ts-ignore
  const backgroundColor = isAuthor ? theme.colors.kakaotalkContainer : theme.colors.surfaceVariant;
  
  return (
    <View style={[styles.container, isAuthor ? styles.rightAlign : styles.leftAlign]}>
      <Card style={{ width: "66%", backgroundColor: backgroundColor }} mode="elevated">
        <Card.Content>
          {comment.commentImageUrl && (
            <ToDoDetailCommentImage commentImageUrl={comment.commentImageUrl} />
          )}
          <Text variant="bodyMedium">{comment.content}</Text>
          <Text variant="bodySmall" style={{ marginTop: 4 }}>
            {comment.author}
          </Text>
          <Text variant="bodySmall" style={{ marginTop: 4 }}>
            {comment.timestamp}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%", // 전체 View가 차지하는 공간
    flexDirection: "row",
    marginTop: 10, // 위아래 여백 추가
  },
  rightAlign: {
    justifyContent: "flex-end", // 오른쪽 정렬
  },
  leftAlign: {
    justifyContent: "flex-start", // 왼쪽 정렬
  },
});