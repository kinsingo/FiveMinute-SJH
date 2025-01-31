import React from "react";
import StatusModule from "@/components/inventory/statusModule";
import { useInventoryItemsMap } from "@/hooks/useInventoryItemsMap";
import { ActivityIndicator } from 'react-native-paper';

export default function Status() {
  const { itemsMap, loading } = useInventoryItemsMap("https://www.5minbowl.com/api/inventory-status/Gangnam");
  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" animating={true} />;
  }
  return <StatusModule itemsMap={itemsMap} />;
}