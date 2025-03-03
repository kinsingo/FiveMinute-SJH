import { useRouter } from "expo-router";
import { List } from "react-native-paper";
import { useState } from "react";
import { LocationProp} from "@/components/todo/instruction-db-manager";

export default function InventoryListAccordian({
  accordianName,
  place,
}: {
  accordianName: string;
  place: LocationProp;
}) {
  const router = useRouter();
  const [expandedGangnam, setExpandedGangnam] = useState(false);
  const toggleGangnam = () => setExpandedGangnam(!expandedGangnam);
  return (
    <List.Accordion
      title={accordianName}
      left={(props) => <List.Icon {...props} icon="store" />}
      expanded={expandedGangnam}
      onPress={toggleGangnam}
    >
      <List.Item
        title="재고 업데이트"
        left={(props) => <List.Icon {...props} icon="update" />}
        onPress={() => router.push(`/inventory/${place}/update`)}
      />
      <List.Item
        title="재고 상태"
        left={(props) => <List.Icon {...props} icon="clipboard-list-outline" />}
        onPress={() => router.push(`/inventory/${place}/status`)}
      />
    </List.Accordion>
  );
}
