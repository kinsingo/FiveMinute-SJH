//ToDoDetailCommentImage
import { Image, View } from "react-native";

export default function ToDoDetailCommentImage({commentImageUrl}: {commentImageUrl: string}) {
  return (
    <View style={{ alignItems: "center", marginBottom: 5 }}>
      <Image
        source={{ uri: commentImageUrl }}
        style={{ width: "100%", height: 160, borderRadius: 8 }}
        resizeMode="stretch"
      />
    </View>
  );
}
