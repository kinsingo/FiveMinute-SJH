import React from "react";
import { SegmentedButtons } from "react-native-paper";

export enum TableType {
  Latest = "최신",
  Previous1 = "이전(1)",
  Previous2 = "이전(2)",
}

interface TableSwitcherProps {
  table: TableType;
  setTable: (table: TableType) => void;
}

export default function TableSelector({ table, setTable }: TableSwitcherProps) {
  return (
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
  );
}
