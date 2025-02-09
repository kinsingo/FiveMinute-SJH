import React from "react";
import { View,  Alert, } from "react-native";
import {  Button} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

export default function ImageUploadButtons({setImageUrl, IsSaving}: {setImageUrl: (imageUrl: string | null) => void, IsSaving: boolean}) {
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
      setImageUrl(image.assets[0].uri);
    }
  };

  // ✅ 카메라로 직접 촬영
  const handleCaptureImage = async () => {
    // ✅ 현재 권한 상태 확인
    let { status } = await ImagePicker.getCameraPermissionsAsync();

    // ✅ 권한이 거부되었거나 없는 경우, 다시 요청
    if (status !== "granted") {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("권한 필요", "갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.");
        return;
      }
    }
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, //약 50% 품질로 저장 (파일 크기 대폭 감소), 충분히 해상도 잘 나옴
    });

    if (!image.canceled) {
      setImageUrl(image.assets[0].uri);
    }
  };

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 20 }}>
      <Button mode="contained-tonal" onPress={handlePickImage} disabled={IsSaving}>
        갤러리에서 선택
      </Button>
      <Button mode="outlined" onPress={handleCaptureImage} disabled={IsSaving}>
        사진 촬영
      </Button>
    </View>
  );
}
