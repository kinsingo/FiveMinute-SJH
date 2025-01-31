import React, { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { DataTable, Text } from "react-native-paper";
import { SegmentedButtons } from "react-native-paper";
import {
  TableHeader,
  RenderedRowItem,
  Row,
} from "./components/statusTableComponents";

export enum TableType {
  Latest = "최신",
  Previous1 = "이전(1)",
  Previous2 = "이전(2)",
}

export interface Item {
  email: string;
  timestamp: string;
  inventoryData: Row[];
}

const StatusModule = ({ itemsMap }: { itemsMap: Record<TableType, Item> }) => {
  const [table, setTable] = useState(TableType.Latest);

  return (
    <>
      <View style={styles.container}>
        <SegmentedButtons
          value={table}
          onValueChange={(table) => {
            setTable(table as TableType);
          }}
          buttons={[
            {
              value: TableType.Latest,
              label: TableType.Latest,
            },
            {
              value: TableType.Previous1,
              label: TableType.Previous1,
            },
            {
              value: TableType.Previous2,
              label: TableType.Previous2,
            },
          ]}
          style={{ marginHorizontal: 5 }}
        />
        <Text style={{ padding: 10, textAlign: "center" }}>
          {itemsMap[table].timestamp}
          {"\n"}
          {itemsMap[table].email} 님에 의해서 업데이트됨
        </Text>
        <DataTable>
          <TableHeader />
          <FlatList
            data={itemsMap[table].inventoryData}
            keyExtractor={(item) => item.key}
            renderItem={RenderedRowItem}
            showsVerticalScrollIndicator={false}
          />
        </DataTable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default StatusModule;
