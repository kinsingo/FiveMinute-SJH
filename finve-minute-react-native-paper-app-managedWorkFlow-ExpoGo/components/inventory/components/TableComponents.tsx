import { DataTable, TextInput } from "react-native-paper";
import { View } from "react-native";

export interface Row {
  [key: string]: any;
}

const columnsMapRight: { label: string; key: string }[] = [
  { label: "현재재고", key: "stock" },
  { label: "발주필요", key: "requiredOrder" },
  { label: "배송중", key: "delivery" },
];

const itemMinWidth = 40;
const cellFontSize = 12;

export const TableHeader = () => {
  return (
    <View style={{ flex: 1, paddingTop: 50 }}>
      <DataTable.Header style={{ position: "absolute", zIndex: 10 }}>
        {/* <DataTable.Title>{"분류"}</DataTable.Title> */}
        <DataTable.Title style={{ minWidth: itemMinWidth }}>
          {"항목"}
        </DataTable.Title>
        <DataTable.Title>{"단위"}</DataTable.Title>
        {columnsMapRight.map(({ label }) => (
          <DataTable.Title key={label}>{label}</DataTable.Title>
        ))}
      </DataTable.Header>
    </View>
  );
};

export function RenderedRowItem({ item }: { item: Row }) {
  return (
    <DataTable.Row key={item.key}>
      {/* <DataTable.Cell textStyle={{ fontSize: 10 }}>
        {item["category"]}
      </DataTable.Cell> */}
      <DataTable.Cell
        textStyle={{ fontSize: cellFontSize }}
        style={{ minWidth: itemMinWidth }}
      >
        {item["item"]}
      </DataTable.Cell>
      <DataTable.Cell textStyle={{ fontSize: cellFontSize }}>
        {item["unit"]}
      </DataTable.Cell>
      {columnsMapRight.map(({ key }, index) => (
        <DataTable.Cell key={index} textStyle={{ fontSize: cellFontSize }}>
          {item[key]}
        </DataTable.Cell>
      ))}
    </DataTable.Row>
  );
}

export function RenderedRowEditableItem({
  item,
  onUpdate,
}: {
  item: Row;
  onUpdate: (updatedItem: Row) => void;
}) {
  // ✅ 입력 필드 변경 핸들러
  const handleInputChange = (key: keyof Row, value: string) => {
    const updatedRow = { ...item, [key]: value };
    onUpdate(updatedRow);
  };
  return (
    <DataTable.Row key={item.key}>
      {/* <DataTable.Cell textStyle={{ fontSize: 10 }}>
        {item["category"]}
      </DataTable.Cell> */}
      <DataTable.Cell
        textStyle={{ fontSize: cellFontSize }}
        style={{ minWidth: itemMinWidth }}
      >
        {item["item"]}
      </DataTable.Cell>
      <DataTable.Cell textStyle={{ fontSize: cellFontSize }}>
        {item["unit"]}
      </DataTable.Cell>
      {columnsMapRight.map(({ key }, index) => (
        <DataTable.Cell key={index}>
          <TextInput
            dense
            mode="outlined"
            value={item[key]?.toString() || ""}
            onChangeText={(text) => handleInputChange(key, text)}
            style={{ width: "95%", fontSize: cellFontSize }}
            autoCorrect={false}        // ✅ 자동 수정(자동완성) 방지
            autoCapitalize="none"      // ✅ 자동 대문자 변환 방지
          />
        </DataTable.Cell>
      ))}
    </DataTable.Row>
  );
}
