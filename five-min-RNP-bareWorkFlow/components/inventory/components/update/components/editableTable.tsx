import React from "react";
import { MyVerticalScrollView } from "@/components/MyScrollView";
import { DataTable } from "react-native-paper";
import { TableHeader, RenderedRowEditableItem, Row } from "../../TableComponents";

interface EditableTableProps {
  localData: Row[];
  handleRowUpdate: (updatedRow: Row) => void;
}

export default function EditableTable({ localData, handleRowUpdate }: EditableTableProps) {
  return (
    <>
      <DataTable>
        <TableHeader />
      </DataTable>
      <MyVerticalScrollView>
        <DataTable>
          {localData.map((item) => (
            <RenderedRowEditableItem key={item.key} item={item} onUpdate={handleRowUpdate} />
          ))}
        </DataTable>
      </MyVerticalScrollView>
    </>
  );
}
