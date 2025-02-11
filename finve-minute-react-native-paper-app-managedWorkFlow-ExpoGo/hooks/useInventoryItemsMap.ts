import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import axios from "axios";
import { Row } from "@/components/inventory/components/TableComponents";
import { TableType } from "@/components/inventory/components/status/components/tableSelector";
import { Item } from "@/components/inventory/components/status/statusModule";
import { useContext } from "react";
import { AuthContext } from "@/store/context/AuthContext";

export const useInventoryItemsMap = (apiUrl: string) => {
  const auth = useContext(AuthContext);
  const [itemsMap, setItemsMap] = useState<Record<TableType, Item>>({
    [TableType.Latest]: {
      email: "",
      nickname: "",
      realname: "",
      timestamp: "",
      inventoryData: [],
      id: "",
    },
    [TableType.Previous1]: {
      email: "",
      nickname: "",
      realname: "",
      timestamp: "",
      inventoryData: [],
      id: "",
    },
    [TableType.Previous2]: {
      email: "",
      nickname: "",
      realname: "",
      timestamp: "",
      inventoryData: [],
      id: "",
    },
  });
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  const fetchStatus = async () => {
    setLoading(true); // ✅ 요청 시작 시 로딩 상태 true
    try {
      const response = await axios.get(apiUrl);
      const latestDocument = response.data;
      const tableTypes: TableType[] = [TableType.Latest, TableType.Previous1, TableType.Previous2];
      const newItemsMap: Record<TableType, Item> = tableTypes.reduce((acc, type, index) => {
        acc[type] = {
          email: latestDocument[index]?.email || "",
          nickname: latestDocument[index]?.nickname,
          realname: latestDocument[index]?.realname,
          timestamp: latestDocument[index]?.timestamp || "",
          inventoryData:
            latestDocument[index]?.inventoryData?.map((item: Row, itemIndex: number) => ({
              ...item,
              key: `${itemIndex}`,
            })) ?? [],
          id: latestDocument[index]?._id || "",
        };
        return acc;
      }, {} as Record<TableType, Item>);
      setItemsMap(newItemsMap);
      const userEmail = (await auth.getCurrentUserEmail()) as string;
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

  return { itemsMap, currentUserEmail, loading, reload: fetchStatus }; // ✅ loading 상태 함께 반환
};
