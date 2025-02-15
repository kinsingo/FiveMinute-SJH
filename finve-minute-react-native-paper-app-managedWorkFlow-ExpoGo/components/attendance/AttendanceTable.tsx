import * as React from "react";
import { useState, useEffect } from "react";
import { DataTable, Text } from "react-native-paper";
import { getDateBeforeDays, getTodayDate } from "@/util/time-manager";
import { MyVerticalScrollView } from "@/components/MyScrollView";
import { View } from "react-native";

export interface AttendanceData {
  email: string;
  date: string;
  checkIn: string[];
  checkOut: string[];
  workHours: number;
}

export default function AttendanceTable({ attendanceData }: { attendanceData: AttendanceData[] }) {
  const today = getTodayDate();
  const _100daysAgo = getDateBeforeDays(100);

  const filteredAttendanceData = attendanceData.filter((item) => {
    // 100일 전 이후 데이터만 유지,나중에 Backend API 에서 100일 데이터만 받도록 해서 Bandwidth 줄이기
    return item.date >= _100daysAgo; 
  });

  return (
    <>
      <Text variant="bodyLarge" style={{textAlign:"center", marginTop: 5}} >100일간의 근태 기록</Text>
      <Text variant="bodyMedium" style={{textAlign:"center"}} >{`${_100daysAgo} ~ ${today}`}</Text>
      <DataTable>
        <View style={{ flex: 1, paddingTop: 50 }}>
          <DataTable.Header style={{ position: "absolute", zIndex: 10 }}>
            <DataTable.Title>{"날자"}</DataTable.Title>
            <DataTable.Title>{"출근시간"}</DataTable.Title>
            <DataTable.Title>{"퇴근시간"}</DataTable.Title>
            <DataTable.Title>{"근무시간"}</DataTable.Title>
          </DataTable.Header>
        </View>
      </DataTable>
      <MyVerticalScrollView>
        <DataTable>
          {filteredAttendanceData.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{item["date"]}</DataTable.Cell> 
              <DataTable.Cell>
                {" "}
                <View>
                  {item.checkIn.map((time, index) => (
                    <Text key={index}>{time}</Text> // ✅ Text 컴포넌트 사용
                  ))}
                </View>
              </DataTable.Cell>
              <DataTable.Cell>
                {" "}
                <View>
                  {item.checkOut.map((time, index) => (
                    <Text key={index}>{time}</Text> // ✅ Text 컴포넌트 사용
                  ))}
                </View>
              </DataTable.Cell>
             <DataTable.Cell>{item["workHours"].toFixed(2)}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </MyVerticalScrollView>
    </>
  );
}
