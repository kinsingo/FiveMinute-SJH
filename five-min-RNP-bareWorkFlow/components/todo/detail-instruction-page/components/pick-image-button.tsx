import { Button, Avatar, useTheme } from "react-native-paper";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function PickImageButton({
  IsSaving,
  setCommentImageUrl,
}: {
  IsSaving: boolean;
  setCommentImageUrl: (url: string) => void;
}) {
  const theme = useTheme();
  // ✅ 갤러리에서 이미지 선택
  const handlePickImage = async () => {
    // ✅ 현재 권한 상태 확인
    let { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

    // ✅ 권한이 거부되었거나 없는 경우, 다시 요청
    if (status !== "granted") {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.");
        return;
      }
    }
    const image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, //약 50% 품질로 저장 (파일 크기 대폭 감소), 충분히 해상도 잘 나옴
    });

    if (!image.canceled) {
      setCommentImageUrl(image.assets[0].uri);
    }
  };
  return (
    <Button mode="text" onPress={handlePickImage} disabled={IsSaving}>
      <Avatar.Icon
        icon="image"
        size={40}
        style={{ backgroundColor: theme.colors.secondaryContainer }}
      />
    </Button>
  );
}
