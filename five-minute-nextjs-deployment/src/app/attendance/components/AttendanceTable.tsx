import ResultTable from "@/components/resultTable";
import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
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
  users,
  setIsError,
  setMessage,
  login_email,
}: {
  attendanceData: AttendanceData[];
  users: User[];
  setIsError: (isError: boolean) => void;
  setMessage: (message: string) => void;
  login_email: string;
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hourlyWage, setHourlyWage] = useState<number>(10000);
  const formatDate = (date: Date | null) =>
    date ? format(date, "yyyy-MM-dd") : null;
  const [editableData, setEditableData] = useState<AttendanceData[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    date: string;
    field: "checkIn" | "checkOut";
    value: string;
  } | null>(null);
  const isAdmin = users.some(
    (user) => user.email === login_email && user.isAdmin
  );

  // 📌 날짜 유효성 검사 (endDate가 startDate보다 빠를 경우 경고)
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setError("⚠️ 종료 날짜는 시작 날짜보다 늦어야 합니다.");
    } else {
      setError(null);
    }
  }, [startDate, endDate]);

  // 📌 기간 내 데이터 필터링
  const filteredData = attendanceData.filter((data) => {
    const dataDate = data.date; // 이미 YYYY-MM-DD 형식으로 저장됨
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return (!start || dataDate >= start) && (!end || dataDate <= end);
  });

  useEffect(() => {
    if (editableData.length === 0 && filteredData.length > 0) {
      setEditableData(filteredData);
    }
  }, [filteredData]);

  const handleEdit = async (
    date: string,
    field: "checkIn" | "checkOut",
    newValue: string[]
  ) => {
    try {
      const selectedUser = users.find(
        (user) => user.email === attendanceData[0]?.email
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
              updated.checkOut
            );
            return updated;
          })
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
    filteredData,
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
