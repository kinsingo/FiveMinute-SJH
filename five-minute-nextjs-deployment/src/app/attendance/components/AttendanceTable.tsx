import ResultTable from "@/components/resultTable";
import * as React from "react";
import { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Alert, Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { User } from "./DashBoard"; // User 타입을 가져옵니다.
import { calculateWorkHours } from "./util";
import {
  getAttendanceRows,
  getAttendanceColumns,
} from "./AttendanceTable/AttendanceData";
import AttendanceAlert from "./AttendanceTable/AttendanceAlert";
import AttendanceTableFilter from "./AttendanceTable/AttendanceTableFilter";
import EditTimeDialog from "./AttendanceTable/EditTimeDialog";

export interface AttendanceData {
  email: string;
  date: string;
  checkIn: string[];
  checkOut: string[];
  workHours: number;
}

export default function AttendanceTable({
  attendanceData,
  filteredAttendanceData,
  users,
  setIsError,
  setMessage,
  login_email,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: {
  attendanceData: AttendanceData[];
  filteredAttendanceData: AttendanceData[];
  users: User[];
  setIsError: (isError: boolean) => void;
  setMessage: (message: string) => void;
  login_email: string;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [hourlyWage, setHourlyWage] = useState<number>(10000);
  const [editableData, setEditableData] = useState<AttendanceData[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    date: string;
    field: "checkIn" | "checkOut";
    value: string;
  } | null>(null);
  const isAdmin = users.some(
    (user) => user.email === login_email && user.isAdmin,
  );

  // 📌 날짜 유효성 검사 (endDate가 startDate보다 빠를 경우 경고)
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setError("⚠️ 종료 날짜는 시작 날짜보다 늦어야 합니다.");
    } else {
      setError(null);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    setEditableData(filteredAttendanceData);
  }, [filteredAttendanceData]);

  const handleEdit = async (
    date: string,
    field: "checkIn" | "checkOut",
    newValue: string[],
  ) => {
    try {
      const selectedUser = users.find(
        (user) => user.email === attendanceData[0]?.email,
      );
      const response = await fetch("/api/react-native-app-attendance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedUser?.email,
          date,
          field,
          values: newValue,
        }),
      });
      if (response.ok) {
        setEditableData((prev) =>
          prev.map((entry) => {
            if (entry.date !== date) return entry;
            const updated = { ...entry, [field]: newValue };
            updated.workHours = calculateWorkHours(
              updated.checkIn,
              updated.checkOut,
            );
            return updated;
          }),
        );
        alert("✅ 데이터 수정 성공");
      } else {
        setMessage(`⚠️ 데이터 수정 실패: 알 수 없는 오류`);
        setIsError(true);
      }
    } catch (error: any) {
      setMessage(`⚠️ ${error.message}`);
      setIsError(true);
    }
  };

  const columns = getAttendanceColumns();
  const rows = getAttendanceRows({
    editableData,
    isAdmin,
    hourlyWage,
    filteredData: filteredAttendanceData,
    setEditDialogOpen,
    setEditTarget,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AttendanceTableFilter
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        hourlyWage={hourlyWage}
        setHourlyWage={setHourlyWage}
      />
      <Box mt={2} mb={1}>
        <AttendanceAlert />
      </Box>
      {error && <Alert severity="warning">{error}</Alert>}
      <ResultTable columns={columns} rows={rows} />
      <EditTimeDialog
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        editTarget={editTarget}
        setEditTarget={setEditTarget}
        handleEdit={handleEdit}
      />
    </LocalizationProvider>
  );
}
