//ToDoDetailCommentImage
import { Image, View } from "react-native";

export default function ToDoDetailCommentImage({commentImageUrl}: {commentImageUrl: string}) {
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={{ uri: commentImageUrl }}
        style={{ width: "80%", height: 200, borderRadius: 8, marginTop: 10 }}
        resizeMode="stretch"
      />
    </View>
  );
}
