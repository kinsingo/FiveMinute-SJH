import ListOfAttendance, {Attendance} from "../../../components/attendance/listOfAttendance"

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
    }
];

export default function Main() {
  return (
    <ListOfAttendance attendanceList={DummyAttendanceList} />
  );
}
