import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import PickImageButton from "@/components/todo/detail-instruction-page/components/pick-image-button";
import AddCommentButton, {
  AddCommentButtonProps,
} from "@/components/todo/detail-instruction-page/components/add-comment-button";

export default function CommentInputModule({
  id,
  content,
  setIsSaving,
  IsSaving,
  commentImageUrl,
  setContent,
  setCommentImageUrl,
  Location,
}: AddCommentButtonProps) {
  return (
    <View style={styles.commentInputContainer}>
      <PickImageButton setCommentImageUrl={setCommentImageUrl} IsSaving={IsSaving} />
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="댓글을 입력하세요..."
        mode="outlined"
        style={styles.commentInput}
        dense
        disabled={IsSaving}
      />

      {content.trim() !== "" && (
        <AddCommentButton
          id={id as string}
          content={content}
          setIsSaving={setIsSaving}
          IsSaving={IsSaving}
          commentImageUrl={commentImageUrl}
          setContent={setContent}
          setCommentImageUrl={setCommentImageUrl}
          Location={Location}
        />
      )}
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
});
