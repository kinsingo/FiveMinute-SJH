import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { AttendanceData } from "./AttendanceTable";
import { getKoreaDate } from "@/util/time-manager";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from "date-fns";
import { DataTable, Divider, Text } from "react-native-paper";
import { View } from "react-native";
import { CartesianChart, Bar } from "victory-native";
import { LinearGradient, vec, useFont } from "@shopify/react-native-skia";
import { MyVerticalScrollView } from "../MyScrollView";
import ThemeModeContext from "@/store/context/ThemeModeContext";

interface SummaryData {
  period: string;
  workHours: number;
  startDate: string;
  endDate: string;
  [key: string]: unknown;
}

interface SummaryDataSet {
  days: SummaryData[];
  weeks: SummaryData[];
  months: SummaryData[];
}

export default function SummaryTable({ attendanceData }: { attendanceData: AttendanceData[] }) {
  const font = useFont(require("@/assets/fonts/NotoSansKR-VariableFont_wght.ttf"), 12);
  const { isThemeDark } = useContext(ThemeModeContext);

  const [summaryData, setSummaryData] = useState<SummaryDataSet>({
    days: [],
    weeks: [],
    months: [],
  });

  useEffect(() => {
    if (attendanceData.length > 0) {
      processWorkHoursSummary(attendanceData);
    }
  }, [attendanceData]);

  function processWorkHoursSummary(data: AttendanceData[]) {
    if (!data || data.length === 0) return;

    const todayStr = getKoreaDate(new Date());
    const yesterdayStr = getKoreaDate(subDays(new Date(), 1));
    const twoDaysAgoStr = getKoreaDate(subDays(new Date(), 2));

    const weekStart = getKoreaDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const weekEnd = getKoreaDate(endOfWeek(new Date(), { weekStartsOn: 1 }));

    const lastWeekStart = getKoreaDate(startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }));
    const lastWeekEnd = getKoreaDate(endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }));

    const lastlastWeekStart = getKoreaDate(
      startOfWeek(subDays(new Date(), 14), { weekStartsOn: 1 })
    );
    const lastlastWeekEnd = getKoreaDate(endOfWeek(subDays(new Date(), 14), { weekStartsOn: 1 }));

    const monthStart = getKoreaDate(startOfMonth(new Date()));
    const monthEnd = getKoreaDate(endOfMonth(new Date()));

    const lastMonthStart = getKoreaDate(startOfMonth(subDays(new Date(), 30)));
    const lastMonthEnd = getKoreaDate(endOfMonth(subDays(new Date(), 30)));

    const lastlastMonthStart = getKoreaDate(startOfMonth(subDays(new Date(), 60)));
    const lastlastMonthEnd = getKoreaDate(endOfMonth(subDays(new Date(), 60)));

    setSummaryData({
      days: [
        {
          period: "오늘",
          workHours: sumWorkHours(data, todayStr),
          startDate: todayStr,
          endDate: "",
        },
        {
          period: "어제",
          workHours: sumWorkHours(data, yesterdayStr),
          startDate: yesterdayStr,
          endDate: "",
        },
        {
          period: "그제",
          workHours: sumWorkHours(data, twoDaysAgoStr),
          startDate: twoDaysAgoStr,
          endDate: "",
        },
      ].map(validateData),

      weeks: [
        {
          period: "이번주",
          workHours: sumWorkHoursBetween(data, weekStart, weekEnd),
          startDate: weekStart,
          endDate: weekEnd,
        },
        {
          period: "저번주",
          workHours: sumWorkHoursBetween(data, lastWeekStart, lastWeekEnd),
          startDate: lastWeekStart,
          endDate: lastWeekEnd,
        },
        {
          period: "2주전",
          workHours: sumWorkHoursBetween(data, lastlastWeekStart, lastlastWeekEnd),
          startDate: lastlastWeekStart,
          endDate: lastlastWeekEnd,
        },
      ].map(validateData),

      months: [
        {
          period: "이번달",
          workHours: sumWorkHoursBetween(data, monthStart, monthEnd),
          startDate: monthStart,
          endDate: monthEnd,
        },
        {
          period: "저번달",
          workHours: sumWorkHoursBetween(data, lastMonthStart, lastMonthEnd),
          startDate: lastMonthStart,
          endDate: lastMonthEnd,
        },
        {
          period: "두달전",
          workHours: sumWorkHoursBetween(data, lastlastMonthStart, lastlastMonthEnd),
          startDate: lastlastMonthStart,
          endDate: lastlastMonthEnd,
        },
      ].map(validateData),
    });
  }

  function sumWorkHours(data: AttendanceData[], date: string): number {
    const total = data.filter((d) => d.date === date).reduce((sum, d) => sum + d.workHours, 0);
    return isNaN(total) ? 0 : total;
  }

  function sumWorkHoursBetween(data: AttendanceData[], start: string, end: string): number {
    const total = data
      .filter((d) => d.date >= start && d.date <= end)
      .reduce((sum, d) => sum + d.workHours, 0);
    return isNaN(total) ? 0 : total;
  }

  function validateData(item: SummaryData): SummaryData {
    return {
      ...item,
      workHours: isNaN(item.workHours) || item.workHours === undefined ? 0 : item.workHours,
    };
  }

  function MyCartesianChart({
    data,
    title,
    color,
    barStartColor,
    barEndColor,
  }: {
    data: SummaryData[];
    title: string;
    color: string;
    barStartColor: string;
    barEndColor: string;
  }) {
    return (
      <View style={{ height: 300, marginVertical: 10, marginHorizontal: 30 }}>
        <Text variant="bodyMedium" style={{ textAlign: "center" }}>
          {title}
        </Text>
        <CartesianChart
          data={data}
          xKey="period"
          yKeys={["workHours"]}
          domainPadding={{ left: 50, right: 50, top: 30 }}
          axisOptions={{
            font,
            labelColor: isThemeDark ? "white" : "black",
            formatXLabel: (value) => (value ? `${value}` : ""),
            formatYLabel: (value) => `${value}h`,
          }}
        >
          {({ points, chartBounds }) =>
            points.workHours.length > 0 && (
              <Bar chartBounds={chartBounds} points={points.workHours} barWidth={30} color={color}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 400)}
                  colors={[barStartColor, barEndColor]}
                />
              </Bar>
            )
          }
        </CartesianChart>
      </View>
    );
  }

  function MyDataTable({ data }: { data: SummaryData[] }) {
    return (
      <DataTable>
        {data.map((item, index) => (
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
    );
  }
  function MyHeaderTable() {
    return (
      <DataTable>
        <View style={{ flex: 1, paddingTop: 50 }}>
          <DataTable.Header style={{ position: "absolute", zIndex: 10 }}>
            <DataTable.Title>{"기간"}</DataTable.Title>
            <DataTable.Title style={{ minWidth: 120 }}>{"날자"}</DataTable.Title>
            <DataTable.Title>{"근무시간"}</DataTable.Title>
          </DataTable.Header>
        </View>
      </DataTable>
    );
  }

  return (
    <>
      <Text variant="bodyLarge" style={{ textAlign: "center", marginTop: 10 }}>
        3달간의 근태 기록
      </Text>

      {/* 3일간 데이터 Bar Chart */}
      <MyVerticalScrollView>
        <MyHeaderTable/>
        <MyDataTable data={summaryData.days} />
        <MyDataTable data={summaryData.weeks} />
        <MyDataTable data={summaryData.months} />

        {summaryData.days.length > 0 && (
          <MyCartesianChart
            data={summaryData.days}
            title="3일간 근태 기록"
            color="blue"
            barStartColor="#3b82f6"
            barEndColor="#3b82f650"
          />
        )}

        {summaryData.weeks.length > 0 && (
          <MyCartesianChart
            data={summaryData.weeks}
            title="3주간 근태 기록"
            color="red"
            barStartColor="#ef4444"
            barEndColor="#ef444450"
          />
        )}

        {summaryData.months.length > 0 && (
          <MyCartesianChart
            data={summaryData.months}
            title="3달간 근태 기록"
            color="green"
            barStartColor="#10b981"
            barEndColor="#10b98150"
          />
        )}
      </MyVerticalScrollView>
    </>
  );
}
