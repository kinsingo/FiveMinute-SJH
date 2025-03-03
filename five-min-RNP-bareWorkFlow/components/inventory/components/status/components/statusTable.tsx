import React from "react";
import { MyVerticalScrollView } from "@/components/MyScrollView";
import { DataTable } from "react-native-paper";
import { TableHeader, RenderedRowItem, Row } from "../../TableComponents";

interface InventoryTableProps {
  rows: Row[];
}

export default function StatusTable({ rows }: InventoryTableProps) {
  return (
    <>
      <DataTable>
        <TableHeader />
      </DataTable>
      <MyVerticalScrollView>
        <DataTable>
          {rows.map((item) => (
            <RenderedRowItem key={item.key} item={item} />
          ))}
        </DataTable>
      </MyVerticalScrollView>
    </>
  );
}
