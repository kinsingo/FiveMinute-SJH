"use client";
import { useState } from "react";
import MKButton from "@/MKcomponents/MKButton";
import { Typography } from "@mui/material";

export default function DeleteStatusButton({
  index,
  color,
  documentEmail,
  currentUserEmail,
  fetchDeleteDataPath,
  documentId,
  onDeleteSuccess,
}: {
  index: number;
  color: MUIColor;
  documentEmail: string;
  currentUserEmail: string;
  fetchDeleteDataPath: string;
  documentId: string;
  onDeleteSuccess: (id: string) => void;

}) {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false); // Pending 상태 관리     

  async function handleDelete() {
    if (currentUserEmail !== documentEmail) {
      setError("현재 로그인된 사용자만 데이터를 삭제할 수 있습니다.");
      return;
    }
    setIsDeleting(true);
    try {
      setError(null); // 기존 오류 초기화
      const response = await fetch(fetchDeleteDataPath, {
        method: "POST",
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
    <>
      <MKButton
        variant="contained"
        color={index === 0 ? color : "secondary"}
        onClick={handleDelete}
        disabled={isDeleting}
      >
       {isDeleting? "삭제중..." : "삭제 하시겠습니까 ?"}
      </MKButton>
      {error && (
        <Typography mt={2} color="error" variant="body2">
          {error}
        </Typography>
      )}
    </>
  );
}
