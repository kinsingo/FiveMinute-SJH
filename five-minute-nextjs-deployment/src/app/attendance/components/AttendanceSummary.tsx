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
} from "date-fns";
import { getKoreaDate } from "@/utils/timeManager";
import { AttendanceData } from "./AttendanceTable";

export interface SummaryData {
  period: string;
  startDate: string;
  endDate: string;
  workHours: string;
}

export default function AttendanceSummary({
  attendanceData,
}: {
  attendanceData: AttendanceData[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);

  useEffect(() => {
    processWorkHoursSummary(attendanceData);
  }, [attendanceData, selectedDate]);

  const columns: Column[] = [
    { name: "기간", align: "center" },
    { name: "날짜", align: "center" },
    { name: "근무 시간", align: "center" },
  ];

  const rows: Row[] =
    summaryData.map((data: any) => ({
      기간: data.period || "N/A",
      날짜: data.endDate
        ? `${data.startDate} ~ ${data.endDate}`
        : data.startDate || "N/A",
      "근무 시간": data.workHours || "0",
      hasBorder: true,
    })) || [];

  function processWorkHoursSummary(data: AttendanceData[]) {
    const endDate = selectedDate || new Date();

    const todayStr = getKoreaDate(endDate);
    const yesterdayStr = getKoreaDate(subDays(endDate, 1));

    // weekStartsOn: 1 옵션으로 월요일부터 일요일까지 계산 (KST 기준 적용)
    const weekStart = getKoreaDate(startOfWeek(endDate, { weekStartsOn: 1 }));
    const weekEnd = getKoreaDate(endOfWeek(endDate, { weekStartsOn: 1 }));

    //선택된 달 기준으로 시작일과 종료일 계산
    const monthStart = getKoreaDate(startOfMonth(endDate));
    const monthEnd = getKoreaDate(endOfMonth(endDate));

    const summary: SummaryData[] = [
      {
        period: "당일",
        startDate: todayStr,
        endDate: "",
        workHours: data
          .filter((d) => d.date === todayStr)
          .reduce((sum, d) => sum + d.workHours, 0).toFixed(2),
      },
      {
        period: "하루전",
        startDate: yesterdayStr,
        endDate: "",
        workHours: data
          .filter((d) => d.date === yesterdayStr)
          .reduce((sum, d) => sum + d.workHours, 0).toFixed(2),
      },
      {
        period: "해당주(월~일)",
        startDate: weekStart,
        endDate: weekEnd,
        workHours: data
          .filter((d) => d.date >= weekStart && d.date <= weekEnd)
          .reduce((sum, d) => sum + d.workHours, 0).toFixed(2),
      },
      {
        period: "해당달",
        startDate: monthStart,
        endDate: monthEnd,
        workHours: data
          .filter((d) => d.date >= monthStart && d.date <= monthEnd)
          .reduce((sum, d) => sum + d.workHours, 0).toFixed(2),
      },
    ];
    setSummaryData(summary);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="조회할 년/월 선택"
        value={selectedDate}
        onChange={(newDate) => {
          if (newDate) {
            setSelectedDate(newDate);
          }
        }}
        slotProps={{
          textField: {
            fullWidth: false,
            InputLabelProps: {
              shrink: true,
            },
          },
        }}
      />
      <ResultTable columns={columns} rows={rows} />
    </LocalizationProvider>
  );
}
