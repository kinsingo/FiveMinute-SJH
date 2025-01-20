import { useRouter } from "expo-router";
import { List } from "react-native-paper";
import React, { useState } from "react";

export default function Inventory() {
  const router = useRouter();
  const [expandedGangnam, setExpandedGangnam] = useState(false);
  const [expandedBundang, setExpandedBundang] = useState(false);
  const toggleGangnam = () => setExpandedGangnam(!expandedGangnam);
  const toggleBundang = () => setExpandedBundang(!expandedBundang);

  return (
    <List.Section>
      {/* Gangnam Branch */}
      <List.Accordion
        title="강남점"
        left={(props) => <List.Icon {...props} icon="store" />}
        expanded={expandedGangnam}
        onPress={toggleGangnam}
      >
        <List.Item
          title="재고 업데이트"
          left={(props) => <List.Icon {...props} icon="update" />}
          onPress={() => router.push("/inventory/Gangnam/update")}
        />
        <List.Item
          title="재고 상태"
          left={(props) => (
            <List.Icon {...props} icon="clipboard-list-outline" />
          )}
          onPress={() => router.push("/inventory/Gangnam/status")}
        />
      </List.Accordion>

      {/* Bundang Branch */}
      <List.Accordion
        title="수내점"
        left={(props) => <List.Icon {...props} icon="store" />}
        expanded={expandedBundang}
        onPress={toggleBundang}
      >
        <List.Item
          title="재고 업데이트"
          left={(props) => <List.Icon {...props} icon="update" />}
          onPress={() => router.push("/inventory/Bundang/update")}
        />
        <List.Item
          title="재고 상태"
          left={(props) => (
            <List.Icon {...props} icon="clipboard-list-outline" />
          )}
          onPress={() => router.push("/inventory/Bundang/status")}
        />
      </List.Accordion>
    </List.Section>
  );
}
