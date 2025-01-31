import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import axios from "axios";
import { Row } from "@/components/inventory/components/statusTableComponents";
import { TableType } from "@/components/inventory/statusModule";
import { Item } from "@/components/inventory/statusModule";

export const useInventoryItemsMap = (apiUrl: string) => {
  const [itemsMap, setItemsMap] = useState<Record<TableType, Item>>({
    [TableType.Latest]: { email: "", timestamp: "", inventoryData: [] },
    [TableType.Previous1]: { email: "", timestamp: "", inventoryData: [] },
    [TableType.Previous2]: { email: "", timestamp: "", inventoryData: [] },
  });
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태 추가

  useFocusEffect(
    useCallback(() => {
      const fetchStatus = async () => {
        setLoading(true); // ✅ 요청 시작 시 로딩 상태 true
        try {
          const response = await axios.get(apiUrl);
          const latestDocument = response.data;

          const newItemsMap: Record<TableType, Item> = {
            [TableType.Latest]: {
              email: latestDocument[0]?.email || "",
              timestamp: latestDocument[0]?.timestamp || "",
              inventoryData:
                latestDocument[0]?.inventoryData?.map(
                  (item: Row, index: number) => ({
                    ...item,
                    key: `${index}`,
                  })
                ) ?? [],
            },

            [TableType.Previous1]:{
                email: latestDocument[1]?.email || "",
                timestamp: latestDocument[1]?.timestamp || "",
                inventoryData:
                  latestDocument[1]?.inventoryData?.map(
                    (item: Row, index: number) => ({
                      ...item,
                      key: `${index}`,
                    })
                  ) ?? [],
              },

            [TableType.Previous2]:{
                email: latestDocument[2]?.email || "",
                timestamp: latestDocument[2]?.timestamp || "",
                inventoryData:
                  latestDocument[2]?.inventoryData?.map(
                    (item: Row, index: number) => ({
                      ...item,
                      key: `${index}`,
                    })
                  ) ?? [],
              },
          };

          setItemsMap(newItemsMap);
        } catch (error) {
          Alert.alert("Database 접근 오류:" + error);
        } finally {
          setLoading(false); // ✅ 요청 완료 후 로딩 상태 false
        }
      };
      fetchStatus();
    }, [apiUrl])
  );

  return { itemsMap, loading }; // ✅ loading 상태 함께 반환
};
