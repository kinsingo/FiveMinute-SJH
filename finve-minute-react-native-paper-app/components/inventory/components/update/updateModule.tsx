import React, { useState } from "react";
import { KeyboardAvoidingView, View, Alert, Platform } from "react-native";
import { Href, useRouter } from "expo-router";
import axios from "axios";
import ButtonGroup from "./components/buttonGroup";
import EditableTable from "./components/editableTable";
import { Row } from "../TableComponents";

export interface DocumentProp {
  inventoryData: Row[];
  redirectPathAfterSuccessfulUpdate: Href;
  currentUserEmail: string;
  uploadURL: string;
}

export default function UpdateModule({
  document,
  reload,
}: {
  document: DocumentProp;
  reload: () => void;
}) {
  const router = useRouter();
  const [localData, setLocalData] = useState<Row[]>(document.inventoryData);
  const [IsAsyncUploading, setIsAsyncUploading] = useState(false);

  const resetData = () => {
    setLocalData((prevData) =>
      prevData.map((row) => ({
        ...row,
        stock: "",
        requiredOrder: "",
        delivery: "",
      }))
    );
  };

  async function uploadData() {
    const timestamp = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Seoul",
    }).format(new Date());
    if (!localData || localData.length === 0) {
      Alert.alert("업로드 실패", "업로드할 데이터가 없습니다.");
      return;
    }
    try {
      setIsAsyncUploading(true);
      const response = await axios.post(document.uploadURL, {
        email: document.currentUserEmail,
        timestamp: timestamp,
        inventoryData: localData,
      });
      if (response.data.success) {
        router.push(document.redirectPathAfterSuccessfulUpdate);
      } else {
        Alert.alert("업로드 실패", response.data.message);
      }
    } catch (error) {
      Alert.alert("업로드 실패", "서버 오류 발생");
    } finally {
      setIsAsyncUploading(false);
    }
  }

  // ✅ 개별 row 값 업데이트
  const handleRowUpdate = (updatedRow: Row) => {
    setLocalData((prevData) =>
      prevData.map((row) => (row.key === updatedRow.key ? updatedRow : row))
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{ flex: 1, paddingHorizontal: 10 }}
          pointerEvents={IsAsyncUploading ? "none" : "auto"}
        >
          <EditableTable
            localData={localData}
            handleRowUpdate={handleRowUpdate}
          />
          <ButtonGroup
            resetData={resetData}
            reload={reload}
            uploadData={uploadData}
            isUploading={IsAsyncUploading}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}
