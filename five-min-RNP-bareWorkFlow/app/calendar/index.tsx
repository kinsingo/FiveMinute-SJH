import CalendarListAccordion from "@/components/calendar/listAccordion";
import { List } from "react-native-paper";

export default function CalendarPage() {
  return (
    <List.Section>
      <CalendarListAccordion place="Gangnam" placeName="강남점" />
      <CalendarListAccordion place="Bundang" placeName="수내점" />
    </List.Section>
  );
}
