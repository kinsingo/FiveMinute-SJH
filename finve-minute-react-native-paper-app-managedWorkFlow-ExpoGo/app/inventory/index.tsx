import { List } from "react-native-paper";
import React from "react";
import InventoryListAccordian from "@/components/inventory/listAccordion";

export default function Inventory() {
  return (
    <List.Section>
      <InventoryListAccordian accordianName="강남점" place="Gangnam" />
      <InventoryListAccordian accordianName="수내점" place="Bundang" />
      <InventoryListAccordian accordianName="신림점" place="Sinlim" />
    </List.Section>
  );
}
