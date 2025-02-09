import React from "react";
import { ScrollView } from "react-native";
import { DataTable } from "react-native-paper";
import {
  TableHeader,
  RenderedRowEditableItem,
  Row,
} from "../../TableComponents";
import ThemeModeContext from "@/store/context/ThemeModeContext";

interface EditableTableProps {
  localData: Row[];
  handleRowUpdate: (updatedRow: Row) => void;
}

export default function EditableTable({
  localData,
  handleRowUpdate,
}: EditableTableProps) {
  const { isThemeDark } = React.useContext(ThemeModeContext);

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
          {localData.map((item) => (
            <RenderedRowEditableItem
              key={item.key}
              item={item}
              onUpdate={handleRowUpdate}
            />
          ))}
        </DataTable>
      </ScrollView>
    </>
  );
}
