import { useState } from "react";
import { Button, Text, useTheme } from "react-native-paper";
import { View } from "react-native";

export default function StatusDeleteButton({
  IsValidUser,
  documentEmail,
  currentUserEmail,
  fetchDeleteDataPath,
  documentId,
  onDeleteSuccess,
  error,
  setError,
}: {
  IsValidUser: boolean;
  documentEmail: string;
  currentUserEmail: string;
  fetchDeleteDataPath: string;
  documentId: string;
  onDeleteSuccess: (id: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false); // Pending 상태 관리
  const theme = useTheme();

  async function handleDelete() {
    if (IsValidUser === false) {
      setError(`데이터 삭제는 ${documentEmail}만 가능\n (현재 로그인: ${currentUserEmail})`);
      return;
    }
    setIsDeleting(true);
    try {
      setError(null); // 기존 오류 초기화
      const response = await fetch(fetchDeleteDataPath, {
        method: "DELETE",
        body: JSON.stringify({ id: documentId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "삭제 요청에 실패했습니다. 다시 시도해 주세요.");
      }
      onDeleteSuccess(documentId);
      alert("데이터가 성공적으로 삭제되었습니다.");
    } catch (err) {
      setError("삭제 요청에 실패했습니다. 다시 시도해 주세요." + "error: " + err);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <View>
      <Button
        mode="contained-tonal"
        style={{ marginHorizontal: 40 }}
        onPress={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "삭제중..." : "현재 데이터를 삭제 하시겠습니까 ?"}
      </Button>
      {error && <Text style={{ textAlign: "center", color: theme.colors.error }}>{error}</Text>}
    </View>
  );
}
