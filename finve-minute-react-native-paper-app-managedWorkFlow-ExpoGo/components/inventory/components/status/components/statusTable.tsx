import React from "react";
import { ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import { TableHeader, RenderedRowItem, Row } from "../../TableComponents";

interface InventoryTableProps {
  isThemeDark: boolean;
  rows: Row[];
}

export default function StatusTable({ isThemeDark, rows }: InventoryTableProps) {
  return (
    <>
      <DataTable>
        <TableHeader />
      </DataTable>
      <ScrollView
        showsVerticalScrollIndicator={true}
        indicatorStyle={isThemeDark ? "white" : "black"}
      >
        <DataTable>
          {rows.map((item) => (
            <RenderedRowItem key={item.key} item={item} />
          ))}
        </DataTable>
      </ScrollView>
    </>
  );
}
