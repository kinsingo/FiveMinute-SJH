import { useRouter } from "expo-router";
import { useState } from "react";
import { List } from "react-native-paper";
import { CalendarKoreanPlaceName, CalendarLocationProp } from "@/features/calendar/types";

export default function CalendarListAccordion({
  place,
  placeName,
}: {
  place: CalendarLocationProp;
  placeName: CalendarKoreanPlaceName;
}) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <List.Accordion
      title={placeName}
      left={(props) => <List.Icon {...props} icon="calendar-month" />}
      expanded={isExpanded}
      onPress={() => setIsExpanded((prev) => !prev)}
    >
      <List.Item
        title="공유 캘린더"
        left={(props) => <List.Icon {...props} icon="account-group-outline" />}
        onPress={() => router.push(`/calendar/${place}`)}
      />
    </List.Accordion>
  );
}
