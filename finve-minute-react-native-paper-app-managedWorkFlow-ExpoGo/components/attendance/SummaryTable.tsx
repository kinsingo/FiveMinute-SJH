import * as React from "react";
import { useState, useEffect } from "react";
import { getDateBeforeDays } from "@/util/time-manager";
import { AttendanceData } from "./AttendanceTable";
import { getKoreaDate } from "@/util/time-manager";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";
import { DataTable, Divider, Text } from "react-native-paper";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { MyVerticalScrollView } from "../MyScrollView";

interface SummaryData {
  period: string;
  startDate: string;
  endDate: string;
  workHours: string;
}

export default function SummaryTable({ attendanceData }: { attendanceData: AttendanceData[] }) {
  const _100daysAgo = getDateBeforeDays(100);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const theme = useTheme();

  const filteredAttendanceData = attendanceData.filter((item) => {
    // 100일 전 이후 데이터만 유지,나중에 Backend API 에서 100일 데이터만 받도록 해서 Bandwidth 줄이기
    return item.date >= _100daysAgo;
  });

  useEffect(() => {
    processWorkHoursSummary(filteredAttendanceData);
  }, [attendanceData]);

  function processWorkHoursSummary(data: AttendanceData[]) {
    const currentMonthEnd = new Date();
    const lastMonthEnd = subDays(startOfMonth(currentMonthEnd), 1);
    const lastlastMonthEnd = subDays(startOfMonth(lastMonthEnd), 1);

    const todayStr = getKoreaDate(currentMonthEnd);
    const yesterdayStr = getKoreaDate(subDays(currentMonthEnd, 1));
    const twoDaysAgoStr = getKoreaDate(subDays(currentMonthEnd, 2));

    // weekStartsOn: 1 옵션으로 월요일부터 일요일까지 계산 (KST 기준 적용)
    const weekStart = getKoreaDate(startOfWeek(currentMonthEnd, { weekStartsOn: 1 }));
    const weekEnd = getKoreaDate(endOfWeek(currentMonthEnd, { weekStartsOn: 1 }));

    // 지난주 계산
    const lastWeekStart = getKoreaDate(
      startOfWeek(subDays(currentMonthEnd, 7), { weekStartsOn: 1 })
    );
    const lastWeekEnd = getKoreaDate(endOfWeek(subDays(currentMonthEnd, 7), { weekStartsOn: 1 }));

    // 지지난주 계산
    const lastlastWeekStart = getKoreaDate(
      startOfWeek(subDays(currentMonthEnd, 14), { weekStartsOn: 1 })
    );
    const lastlastWeekEnd = getKoreaDate(
      endOfWeek(subDays(currentMonthEnd, 14), { weekStartsOn: 1 })
    );

    //선택된 달 기준으로 시작일과 종료일 계산
    const monthStart = getKoreaDate(startOfMonth(currentMonthEnd));
    const monthEnd = getKoreaDate(endOfMonth(currentMonthEnd));

    const lastmonthStart = getKoreaDate(startOfMonth(lastMonthEnd));
    const lastmonthEnd = getKoreaDate(endOfMonth(lastMonthEnd));

    const lastlastmonthStart = getKoreaDate(startOfMonth(lastlastMonthEnd));
    const lastlastmonthEnd = getKoreaDate(endOfMonth(lastlastMonthEnd));

    const summary: SummaryData[] = [
      {
        period: "오늘",
        startDate: todayStr,
        endDate: "",
        workHours: data
          .filter((d) => d.date === todayStr)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "어제",
        startDate: yesterdayStr,
        endDate: "",
        workHours: data
          .filter((d) => d.date === yesterdayStr)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "그제",
        startDate: twoDaysAgoStr,
        endDate: "",
        workHours: data
          .filter((d) => d.date === twoDaysAgoStr)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "이번주",
        startDate: weekStart,
        endDate: weekEnd,
        workHours: data
          .filter((d) => d.date >= weekStart && d.date <= weekEnd)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "저번주",
        startDate: lastWeekStart,
        endDate: lastWeekEnd,
        workHours: data
          .filter((d) => d.date >= lastWeekStart && d.date <= lastWeekEnd)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "2주전",
        startDate: lastlastWeekStart,
        endDate: lastlastWeekEnd,
        workHours: data
          .filter((d) => d.date >= lastlastWeekStart && d.date <= lastlastWeekEnd)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "이번달",
        startDate: monthStart,
        endDate: monthEnd,
        workHours: data
          .filter((d) => d.date >= monthStart && d.date <= monthEnd)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "저번달",
        startDate: lastmonthStart,
        endDate: lastmonthEnd,
        workHours: data
          .filter((d) => d.date >= lastmonthStart && d.date <= lastmonthEnd)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
      {
        period: "2달전",
        startDate: lastlastmonthStart,
        endDate: lastlastmonthEnd,
        workHours: data
          .filter((d) => d.date >= lastlastmonthStart && d.date <= lastlastmonthEnd)
          .reduce((sum, d) => sum + d.workHours, 0)
          .toFixed(2),
      },
    ];
    setSummaryData(summary);
  }

  return (
    <>
      <Text variant="bodyLarge" style={{ textAlign: "center", marginTop: 5 }}>
        3달간의 근태 기록
      </Text>
      <MyVerticalScrollView>
        <DataTable>
          <View style={{ flex: 1, paddingTop: 50 }}>
            <DataTable.Header style={{ position: "absolute", zIndex: 10 }}>
              <DataTable.Title>{"기간"}</DataTable.Title>
              <DataTable.Title style={{ minWidth: 120 }}>{"날자"}</DataTable.Title>
              <DataTable.Title>{"근무시간"}</DataTable.Title>
            </DataTable.Header>
          </View>
        </DataTable>
        <DataTable>
          {summaryData.map((item, index) => (
            <React.Fragment key={index}>
              <DataTable.Row>
                <DataTable.Cell>{item.period}</DataTable.Cell>
                <DataTable.Cell style={{ minWidth: 120 }}>
                  <Text>
                    {item.endDate ? `${item.startDate} ~ ${item.endDate}` : item.startDate || "N/A"}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>{item.workHours}</DataTable.Cell>
              </DataTable.Row>
              {index % 3 === 2 && <Divider style={{ height: 0.8 }} />}
            </React.Fragment>
          ))}
        </DataTable>
      </MyVerticalScrollView>
    </>
  );
}
