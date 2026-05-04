"use client";
import ResultTable, { Column, Row } from "@/components/resultTable";
import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect, useState } from "react";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  format,
} from "date-fns";
import { getKoreaDate } from "@/utils/timeManager";
import { AttendanceData } from "./AttendanceTable";
import { Box, TextField } from "@mui/material";

export interface SummaryData {
  period: string;
  startDate: string;
  endDate: string;
  workHours: string;
  급여: string;
}

export default function AttendanceSummary({
  attendanceData,
  startDate,
  endDate,
}: {
  attendanceData: AttendanceData[];
  startDate: Date | null;
  endDate: Date | null;
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [hourlyWage, setHourlyWage] = useState<number>(10000);
  const hasCustomRange = Boolean(startDate || endDate);

  useEffect(() => {
    processWorkHoursSummary(attendanceData);
  }, [attendanceData, selectedDate, hourlyWage, startDate, endDate]);

  const columns: Column[] = [
    { name: "기간", align: "center" },
    { name: "날짜", align: "center" },
    { name: "근무 시간", align: "center" },
    { name: "급여", align: "center" },
  ];

  const rows: Row[] =
    summaryData.map((data: any) => ({
      기간: data.period || "N/A",
      날짜: data.endDate
        ? `${data.startDate} ~ ${data.endDate}`
        : data.startDate || "N/A",
      "근무 시간": data.workHours || "0",
      급여: data.급여 || "0",
      hasBorder: true,
    })) || [];

  function processWorkHoursSummary(data: AttendanceData[]) {
    function getSalaryInfo(workHours: string) {
      return (parseFloat(workHours) * hourlyWage).toFixed(0) || "N/A";
    }

    if (hasCustomRange) {
      const totalWorkHours = data
        .reduce((sum, attendance) => sum + attendance.workHours, 0)
        .toFixed(2);

      setSummaryData([
        {
          period: "선택 기간",
          startDate: startDate ? format(startDate, "yyyy-MM-dd") : "처음",
          endDate: endDate ? format(endDate, "yyyy-MM-dd") : "현재",
          workHours: totalWorkHours,
          급여: getSalaryInfo(totalWorkHours),
        },
      ]);
      return;
    }

    const referenceDate = selectedDate || new Date();

    const todayStr = getKoreaDate(referenceDate);
    const yesterdayStr = getKoreaDate(subDays(referenceDate, 1));

    // weekStartsOn: 1 옵션으로 월요일부터 일요일까지 계산 (KST 기준 적용)
    const weekStart = getKoreaDate(
      startOfWeek(referenceDate, { weekStartsOn: 1 }),
    );
    const weekEnd = getKoreaDate(endOfWeek(referenceDate, { weekStartsOn: 1 }));

    //선택된 달 기준으로 시작일과 종료일 계산
    const monthStart = getKoreaDate(startOfMonth(referenceDate));
    const monthEnd = getKoreaDate(endOfMonth(referenceDate));

    const dailyWorkHours = data
      .filter((d) => d.date === todayStr)
      .reduce((sum, d) => sum + d.workHours, 0)
      .toFixed(2);

    const yesterdayWorkHours = data
      .filter((d) => d.date === yesterdayStr)
      .reduce((sum, d) => sum + d.workHours, 0)
      .toFixed(2);

    const lastWeekWorkHours = data
      .filter((d) => d.date >= weekStart && d.date <= weekEnd)
      .reduce((sum, d) => sum + d.workHours, 0)
      .toFixed(2);

    const MonthlyWorkHours = data
      .filter((d) => d.date >= monthStart && d.date <= monthEnd)
      .reduce((sum, d) => sum + d.workHours, 0)
      .toFixed(2);

    const summary: SummaryData[] = [
      {
        period: "당일",
        startDate: todayStr,
        endDate: "",
        workHours: dailyWorkHours,
        급여: getSalaryInfo(dailyWorkHours),
      },
      {
        period: "하루전",
        startDate: yesterdayStr,
        endDate: "",
        workHours: yesterdayWorkHours,
        급여: getSalaryInfo(yesterdayWorkHours),
      },
      {
        period: "해당주(월~일)",
        startDate: weekStart,
        endDate: weekEnd,
        workHours: lastWeekWorkHours,
        급여: getSalaryInfo(lastWeekWorkHours),
      },
      {
        period: "해당달",
        startDate: monthStart,
        endDate: monthEnd,
        workHours: MonthlyWorkHours,
        급여: getSalaryInfo(MonthlyWorkHours),
      },
    ];
    setSummaryData(summary);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box flexDirection="row" display="flex">
        <DatePicker
          label={hasCustomRange ? "기간 필터 사용 중" : "조회할 년/월 선택"}
          value={selectedDate}
          onChange={(newDate) => {
            if (newDate) {
              setSelectedDate(newDate);
            }
          }}
          disabled={hasCustomRange}
          slotProps={{
            textField: {
              fullWidth: false,
              InputLabelProps: {
                shrink: true,
              },
            },
          }}
        />
        <Box sx={{ ml: 2 }} />
        <TextField
          value={hourlyWage}
          onChange={(event) => setHourlyWage(Number(event.target.value))}
          label="시급"
          variant="outlined"
        />
      </Box>
      <ResultTable columns={columns} rows={rows} />
    </LocalizationProvider>
  );
}
