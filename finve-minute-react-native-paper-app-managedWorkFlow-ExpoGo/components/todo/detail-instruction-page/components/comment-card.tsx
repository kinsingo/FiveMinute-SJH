import React from "react";
import { Text, Card, useTheme } from "react-native-paper";
import { CommentProps } from "@/components/todo/instruction-db-manager";
import ToDoDetailCommentImage from "@/components/todo/detail-instruction-page/components/todo-detail-comment-image";

export default function CommentCard({ comment }: { comment: CommentProps }) {
  const theme = useTheme();
  return (
    <Card
      style={{ marginTop: 10, backgroundColor: theme.colors.background }}
      mode="outlined"
    >
      <Card.Content>
        {comment.commentImageUrl && (
          <ToDoDetailCommentImage commentImageUrl={comment.commentImageUrl} />
        )}
        <Text variant="bodyMedium">{comment.content}</Text>
        <Text variant="bodySmall" style={{ marginTop: 4 }}>
          {comment.author} {comment.timestamp}
        </Text>
      </Card.Content>
    </Card>
  );
}
