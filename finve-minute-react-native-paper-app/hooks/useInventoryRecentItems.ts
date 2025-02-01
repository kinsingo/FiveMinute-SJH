import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import axios from "axios";
import { Row } from "@/components/inventory/components/TableComponents";
import { GetCurrentUserEmail } from "@/components/login/auth";

export const useInventoryRecentItems = (apiUrl: string) => {
  const [inventoryData, setInventoryData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const fetchStatus = async () => {
    setLoading(true); // ✅ 요청 시작 시 로딩 상태 true
    try {
      const response = await axios.get(apiUrl);
      const latestInventoryData = response.data;
      const latestInventoryDataWithKey = latestInventoryData?.map(
        (item: Row, itemIndex: number) => ({
          ...item,
          key: `${itemIndex}`,
        })
      ) ?? [];
      setInventoryData(latestInventoryDataWithKey);
      const userEmail = (await GetCurrentUserEmail()) as string;
      setCurrentUserEmail(userEmail);
    } catch (error) {
      Alert.alert("Database 접근 오류:" + error);
    } finally {
      setLoading(false); // ✅ 요청 완료 후 로딩 상태 false
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStatus();
    }, [apiUrl])
  );

  return { inventoryData, currentUserEmail, loading, reload: fetchStatus }; // ✅ loading 상태 함께 반환
};
