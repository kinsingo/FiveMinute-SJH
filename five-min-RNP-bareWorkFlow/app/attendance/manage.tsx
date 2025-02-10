import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useScanBLEs, validIbeaconE7Name } from "@/hooks/useScanBLEs";
import { Card, Text, RadioButton } from "react-native-paper";
import { AuthContext } from "@/store/context/AuthContext";
import ThemeModeContext from "@/store/context/ThemeModeContext";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { get24hTime, calculateWorkHours } from "@/util/time-manager";
import WorkAttendanceButtonGroup from "@/components/attendance/WorkAttendanceButtonGroup";
import { ScrollView } from "react-native-gesture-handler";

const ATTENDANCE_URL = "https://www.5minbowl.com/api/react-native-app-attendance"; // Next.js Attendance API 경로

export default function WorkAttendanceScreen() {
  const [selectedLocation, setSelectedLocation] = useState<validIbeaconE7Name>("5minGN");
  const { IsVaidArea, isScanning, setValidBeaconName } = useScanBLEs();
  const auth = useContext(AuthContext);
  const { isThemeDark } = useContext(ThemeModeContext);
  const [checkIn, setCheckIn] = useState<string[]>(["", "", ""]);
  const [checkOut, setCheckOut] = useState<string[]>(["", "", ""]);
  const [workHours, setWorkHours] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      async function fetchAttendance() {
        try {
          const response = await axios.get(ATTENDANCE_URL, { params: { email: auth.user?.email } });
          setCheckIn(response.data.checkIn);
          setCheckOut(response.data.checkOut);
        } catch (error: any) {
          Alert.alert("🚨 서버 응답: " + error.message);
        }
      }
      fetchAttendance();
    }, [])
  );

  useEffect(() => {
    setWorkHours(calculateWorkHours(checkIn, checkOut));
  }, [checkIn, checkOut]);

  useEffect(() => {
    setValidBeaconName(selectedLocation);
  }, [selectedLocation, setValidBeaconName]);

  async function CheckinForWork(attendanceIndex: number) {
    if (await IsVaidArea()) {
      try {
        const timestamp = get24hTime();
        const response = await axios.post(ATTENDANCE_URL, {
          email: auth.user?.email,
          timestamp: timestamp,
          attendanceIndex, // 출근 인덱스
          isCheckIn: true,
        });

        console.log("response.data : " + response.data);

        if (response.data.success) {
          // ✅ 서버 응답을 반영하여 즉시 상태 업데이트
          setCheckIn((prev) => {
            const updatedCheckIn = [...prev];
            updatedCheckIn[attendanceIndex] = timestamp;
            return updatedCheckIn;
          });
          Alert.alert(
            response.data.message,
            auth.user?.email + " 님의 출근이 정상적으로 처리되었습니다."
          );
        } else {
          Alert.alert(response.data.message);
        }
      } catch (error: any) {
        Alert.alert("🚨 서버 응답: " + error.message);
      }
    } else {
      Alert.alert("출근 실패", "올바른 위치에 있지 않습니다. 가게 근처로 이동해주세요.");
    }
  }

  async function CheckoutForWork(attendanceIndex: number) {
    if (await IsVaidArea()) {
      try {
        const timestamp = get24hTime();
        const response = await axios.post(ATTENDANCE_URL, {
          email: auth.user?.email,
          timestamp: timestamp,
          attendanceIndex,
          isCheckIn: false,
        });

        if (response.data.success) {
          // ✅ 서버 응답을 반영하여 즉시 상태 업데이트
          setCheckOut((prev) => {
            const updatedCheckOut = [...prev];
            updatedCheckOut[attendanceIndex] = timestamp;
            return updatedCheckOut;
          });
          Alert.alert(
            response.data.message,
            auth.user?.email + " 님의 퇴근이 정상적으로 처리되었습니다."
          );
          setWorkHours(response.data.workHours);
        } else {
          Alert.alert(response.data.message);
        }
      } catch (error: any) {
        Alert.alert("🚨 서버 응답: " + error.message);
      }
    } else {
      Alert.alert("퇴근 실패", "올바른 위치에 있지 않습니다. 가게 근처로 이동해주세요.");
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <Text variant="bodyLarge" style={styles.title}>
            근태 관리
          </Text>
          <Text variant="bodyMedium" style={styles.title}>
            일한 시간 : {workHours.toFixed(2)} 시간
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            indicatorStyle={isThemeDark ? "white" : "black"}
          >
            <RadioButton.Group
              onValueChange={(value) => setSelectedLocation(value as validIbeaconE7Name)}
              value={selectedLocation}
            >
              <View style={styles.radioContainer}>
                <RadioButton.Item label="강남점" value="5minGN" disabled={isScanning} />
                <RadioButton.Item label="수내점" value="5minSN" disabled={isScanning} />
                <RadioButton.Item label="관악점" value="5minSL" disabled={isScanning} />
              </View>
            </RadioButton.Group>
          </ScrollView>
          <ScrollView
            style={{ height: 300 }}
            indicatorStyle={isThemeDark ? "white" : "black"}
            showsVerticalScrollIndicator={true}
          >
            {checkIn.map((_, index) => (
              <WorkAttendanceButtonGroup
                key={index}
                attendanceIndex={index}
                checkIn={checkIn}
                checkOut={checkOut}
                isScanning={isScanning}
                onCheckIn={CheckinForWork}
                onCheckOut={CheckoutForWork}
              />
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
  },
  radioContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
