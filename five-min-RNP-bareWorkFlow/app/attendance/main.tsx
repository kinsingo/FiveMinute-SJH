import ListOfAttendance, { Attendance } from "../../components/attendance/listOfAttendance";
import { StyleSheet} from "react-native";
export default function main() {

  return <ListOfAttendance attendanceList={DummyAttendanceList} />;
}

const DummyAttendanceList: Attendance[] = [
  {
    start: new Date("2023-10-01T08:00:00"),
    end: new Date("2023-10-01T17:00:00"),
  },
  {
    start: new Date("2023-10-02T08:30:00"),
    end: new Date("2023-10-02T17:30:00"),
  },
  {
    start: new Date("2023-10-03T09:00:00"),
    end: new Date("2023-10-03T18:00:00"),
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
