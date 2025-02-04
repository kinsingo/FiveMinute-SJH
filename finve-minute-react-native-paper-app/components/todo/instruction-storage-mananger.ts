import { storage } from "@/firebase/services";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * ✅ Firebase Storage에 이미지 업로드
 * @param uri 업로드할 이미지의 로컬 URI
 * @returns 업로드된 이미지의 다운로드 URL 또는 null
 */
export const uploadImageToFirebase = async (uri: string): Promise<string | null> => {
  if (!uri) return null;

  try {
    const response = await fetch(uri);
    const blob = await response.blob(); // 🔥 이미지 Blob 변환

    const filename = `instructions/${new Date().getTime()}_${Math.random()
      .toString(36)
      .substring(7)}.jpg`;

    const storageRef = ref(storage, filename);

    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // (옵션) 업로드 진행률 확인 가능
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("🔥 Firebase Storage 업로드 실패:", error);
          reject(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("✅ Firebase Storage 업로드 성공:", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("🔥 이미지 변환 또는 업로드 오류:", error);
    return null;
  }
};

/**
 * ✅ Firebase Storage에서 이미지 삭제
 * @param filename 삭제할 파일 경로 (예: "instructions/12345.jpg")
 * @returns 성공 여부
 */
export const deleteImageFromFirebase = async (filename: string): Promise<boolean> => {
  try {
    const storageRef = ref(storage, filename);
    await deleteObject(storageRef);
    console.log("✅ Firebase Storage 삭제 성공:", filename);
    return true;
  } catch (error) {
    console.error("🔥 Firebase Storage 삭제 실패:", error);
    return false;
  }
};
