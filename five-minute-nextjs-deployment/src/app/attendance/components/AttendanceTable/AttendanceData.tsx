import { isValidCheckInCheckOut } from "../util";
import { AttendanceData } from "../AttendanceTable";
import Box from "@mui/material/Box";
import { Column, Row } from "@/components/resultTable";

export function getAttendanceColumns(): Column[] {
  return [
    { name: "날짜", align: "center" },
    { name: "출근 시간", align: "center" },
    { name: "퇴근 시간", align: "center" },
    { name: "근무 시간", align: "center" },
    { name: "일당", align: "center" },
  ];
}

export function getAttendanceRows({
  editableData,
  isAdmin,
  hourlyWage,
  filteredData,
  setEditDialogOpen,
  setEditTarget,
}: {
  editableData: AttendanceData[];
  isAdmin: boolean | undefined;
  hourlyWage: number;
  filteredData: AttendanceData[];
  setEditDialogOpen: (open: boolean) => void;
  setEditTarget: (
    target: {
      date: string;
      field: "checkIn" | "checkOut";
      value: string;
    } | null
  ) => void;
}): Row[] {
  const handleTimeClick = (
    date: string,
    field: "checkIn" | "checkOut",
    current: string[]
  ) => {
    if (!isAdmin) return;
    setEditTarget({
      date,
      field,
      value: current.join(", "),
    });
    setEditDialogOpen(true);
  };

  const sortedWorkHours = [...filteredData]
    .map((data) => data.workHours)
    .sort((a, b) => a - b); // 오름차순 정렬
  const percentileIndex = Math.floor(sortedWorkHours.length * 0.1); // 하위 10%
  const thresholdWorkHours = sortedWorkHours[percentileIndex] ?? 0;

  return editableData.map((data) => ({
    날짜: data.date || "N/A",
    "출근 시간": (
      <Box
        sx={{
          cursor: isAdmin ? "pointer" : "default",
          textDecoration: isAdmin ? "underline" : "none",
        }}
        onClick={() => handleTimeClick(data.date, "checkIn", data.checkIn)}
      >
        {data.checkIn.join(", ") || "N/A"}
      </Box>
    ),
    "퇴근 시간": (
      <Box
        sx={{
          cursor: isAdmin ? "pointer" : "default",
          textDecoration: isAdmin ? "underline" : "none",
        }}
        onClick={() => handleTimeClick(data.date, "checkOut", data.checkOut)}
      >
        {data.checkOut.join(", ") || "N/A"}
      </Box>
    ),
    "근무 시간": data.workHours.toFixed(2) || "N/A",
    일당: (data.workHours * hourlyWage).toFixed(0) || "N/A",
    hasBorder: true,
    warning:
      data.workHours < thresholdWorkHours ||
      data.checkIn.length > data.checkOut.length ||
      data.checkIn.length === 0,
    error:
      data.checkIn.length < data.checkOut.length ||
      (data.checkIn.length === data.checkOut.length &&
        data.checkIn.some((checkInTime, index) => {
          const checkOutTime = data.checkOut[index];
          return !isValidCheckInCheckOut(checkInTime, checkOutTime);
        })),
  }));
}
