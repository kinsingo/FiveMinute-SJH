import { Attendance } from "../listOfAttendance";

export function calculateTotalHours(attendanceList: Attendance[]): number {
  return attendanceList.reduce((total, attendance) => {
    return total + getWorkingHours(attendance);
  }, 0);
}

export function getWorkingHours(attendance: Attendance): number {
  const workinghours =  (attendance.end.getTime() - attendance.start.getTime()) / 1000 / 60 / 60;
  return parseFloat(workinghours.toFixed(2));
}
