import React, { useState, useContext, useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Row } from "../TableComponents";
import ThemeModeContext from "@/store/context/ThemeModeContext";
import StatusDeleteButton from "./components/statusDeleteButton";
import CategorySelector, { categories } from "./components/categorySelector";
import TableSelector, { TableType } from "./components/tableSelector";
import StatusTable from "./components/statusTable";

export interface Item {
  email: string;
  timestamp: string;
  id: string;
  inventoryData: Row[];
}

export interface DocumentProps {
  itemsMap: Record<TableType, Item>;
  fetchDeleteDataPath: string;
  currentUserEmail: string;
}

const StatusModule = ({
  documents,
  onDeleteSuccess,
}: {
  documents: DocumentProps;
  onDeleteSuccess: (id: string) => void;
}) => {
  const [table, setTable] = useState(TableType.Latest);
  const { isThemeDark } = useContext(ThemeModeContext);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [rows, setRows] = useState(documents.itemsMap[table].inventoryData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const filteredRows = documents.itemsMap[table].inventoryData.filter(
      (row: any) => {
        if (selectedCategory === "전부 다 보기") {
          return true;
        } else {
          return row["category"] === selectedCategory;
        }
      }
    );
    setRows(filteredRows);
  }, [table, selectedCategory]);

  function TableChange(table:TableType)
  {
      setTable(table);
      setError(null);
  }

  const IsValidUser = documents.itemsMap[table].email === documents.currentUserEmail;

  return (
    <>
      <View style={{ flex: 1, padding: 10 }}>
        <TableSelector table={table} setTable={TableChange} />
        <Text style={{ padding: 10, textAlign: "center" }}>
          {documents.itemsMap[table].timestamp || ""}
          {"\n"}
          {documents.itemsMap[table].email || ""} 님에 의해서 업데이트됨
        </Text>

        {IsValidUser && (<StatusDeleteButton
          documentEmail={documents.itemsMap[table].email}
          currentUserEmail={documents.currentUserEmail}
          fetchDeleteDataPath={documents.fetchDeleteDataPath}
          documentId={documents.itemsMap[table].id}
          onDeleteSuccess={onDeleteSuccess}
          error={error}
          setError={setError}
        />)}
        
        <CategorySelector
          isThemeDark={isThemeDark}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <StatusTable isThemeDark={isThemeDark} rows={rows} />
      </View>
    </>
  );
};

export default StatusModule;
