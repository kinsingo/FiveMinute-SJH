import { DataTable } from "react-native-paper";

export interface Row {
  [key: string]: any;
}

const columnsMap: { label: string; key: string }[] = [
  { label: "분류", key: "category" },
  { label: "항목", key: "item" },
  { label: "단위", key: "unit" },
];

const columnsMapRight: { label: string; key: string }[] = [
  { label: "현재재고", key: "stock" },
  { label: "발주필요", key: "requiredOrder" },
  { label: "배송중", key: "delivery" },
];

export const TableHeader = () => {
  return (
    <DataTable.Header>
      {columnsMap.map(({ label }, index) => (
        <DataTable.Title key={index}>{label}</DataTable.Title>
      ))}
      {columnsMapRight.map(({ label }, index) => (
        <DataTable.Title key={index} numeric>{label}</DataTable.Title>
      ))}
    </DataTable.Header>
  );
}

export const RenderedRowItem = ({ item }: { item: Row }) => (
  <DataTable.Row key={item.key}>
    {columnsMap.map(({ key }, index) => (
      <DataTable.Cell key={index} textStyle={{ textAlign: "center" }}>
        {item[key]}
      </DataTable.Cell>
    ))}
    {columnsMapRight.map(({ key }, index) => (
      <DataTable.Cell key={index} numeric>
        {item[key]}
      </DataTable.Cell>
    ))}
  </DataTable.Row>
);


