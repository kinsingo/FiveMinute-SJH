import React, { useState, useContext, useMemo } from "react";
import { KeyboardAvoidingView, View, Alert, Platform } from "react-native";
import { Href, useRouter } from "expo-router";
import axios from "axios";
import ButtonGroup from "./components/buttonGroup";
import EditableTable from "./components/editableTable";
import { Row } from "../TableComponents";
import { getTimeStamp } from "@/util/time-manager";
import { AuthContext } from "@/store/context/AuthContext";
import CategorySelector, { categories } from "../components/categorySelector";

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
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [IsAsyncUploading, setIsAsyncUploading] = useState(false);
  const auth = useContext(AuthContext);

  const filteredData = useMemo(() => {
    return selectedCategory === "전부 다 보기"
      ? localData
      : localData.filter((row) => row.category === selectedCategory);
  }, [selectedCategory, localData]); // ✅ localData 변경 시 필터링된 데이터만 업데이트됨

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
    if (!localData || localData.length === 0) {
      Alert.alert("업로드 실패", "업로드할 데이터가 없습니다.");
      return;
    }
    try {
      setIsAsyncUploading(true);
      const response = await axios.post(document.uploadURL, {
        email: document.currentUserEmail,
        nickname: auth.userInfo?.nickname,
        realname: auth.userInfo?.realname,
        timestamp: getTimeStamp(),
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
          <CategorySelector
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <EditableTable localData={filteredData} handleRowUpdate={handleRowUpdate} />
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
