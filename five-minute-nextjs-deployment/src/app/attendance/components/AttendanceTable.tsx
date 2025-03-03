import ResultTable, { Column, Row } from "@/components/resultTable";
import * as React from "react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Alert, Box } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useMediaQuery } from "@mui/material";

export interface AttendanceData {
  email: string;
  date: string;
  checkIn: string[];
  checkOut: string[];
  workHours: number;
}

export default function AttendanceTable({
  attendanceData,
}: {
  attendanceData: AttendanceData[];
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const formatDate = (date: Date | null) =>
    date ? format(date, "yyyy-MM-dd") : null;
  const isSmallScreen = useMediaQuery("(max-width:768px)");

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

  const columns: Column[] = isSmallScreen? [
    { name: "날짜", align: "center" },
    { name: "근무 시간", align: "center" },
  ]: [
    { name: "날짜", align: "center" },
    { name: "출근 시간", align: "center" },
    { name: "퇴근 시간", align: "center" },
    { name: "근무 시간", align: "center" },
  ];

  const rows: Row[] = isSmallScreen?
  filteredData.map((data: any) => ({
    날짜: data.date || "N/A",
    "근무 시간": data.workHours.toFixed(2) || "N/A",
    hasBorder: true,
  })) || [] :
  filteredData.map((data: any) => ({
    날짜: data.date || "N/A",
    "출근 시간": data.checkIn.join(", ") || "N/A",
    "퇴근 시간": data.checkOut.join(", ") || "N/A",
    "근무 시간": data.workHours.toFixed(2) || "N/A",
    hasBorder: true,
  })) || []

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box flexDirection="row" display="flex">
        <DatePicker
          label="시작 날짜"
          value={startDate}
          onChange={setStartDate}
          slotProps={{
            textField: {
              fullWidth: false,
              InputLabelProps: {
                shrink: true,
              },
            },
          }}
        />
        <Box sx={{ ml: 2 }}/>
        <DatePicker
          label="종료 날짜"
          value={endDate}
          onChange={setEndDate}
          slotProps={{
            textField: {
              fullWidth: false,
              InputLabelProps: {
                shrink: true,
              },
            },
          }}
        />
      </Box>
      {error && <Alert severity="warning">{error}</Alert>}
      <ResultTable columns={columns} rows={rows} />
    </LocalizationProvider>
  );
}
