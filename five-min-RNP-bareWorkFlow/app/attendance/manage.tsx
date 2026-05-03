import { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useScanBLEs, validIbeaconE7Name } from "@/hooks/useScanBLEs";
import { Button, Card, Text, RadioButton } from "react-native-paper";
import { AuthContext } from "@/store/context/AuthContext";
import ThemeModeContext from "@/store/context/ThemeModeContext";
import { subMonths } from "date-fns";
import { useFocusEffect } from "expo-router";
import axios from "axios";
import { get24hTime, calculateWorkHours, getKoreaDate } from "@/util/time-manager";
import WorkAttendanceButtonGroup from "@/components/attendance/WorkAttendanceButtonGroup";
import { ScrollView } from "react-native-gesture-handler";
import MyActivityIndicator from "@/components/MyActivityIndicator";

const ATTENDANCE_URL = "https://www.5minbowl.com/api/react-native-app-attendance"; // Next.js Attendance API 경로

export default function WorkAttendanceScreen() {
  const [selectedLocation, setSelectedLocation] = useState<validIbeaconE7Name>("5minGN");
  const { IsVaidArea, setValidBeaconName } = useScanBLEs();
  const auth = useContext(AuthContext);
  const { isThemeDark } = useContext(ThemeModeContext);
  const [checkIn, setCheckIn] = useState<string[]>(["", "", ""]);
  const [checkOut, setCheckOut] = useState<string[]>(["", "", ""]);
  const [checkInLocation, setCheckInLocation] = useState<string[]>(["", "", ""]);
  const [checkOutLocation, setCheckOutLocation] = useState<string[]>(["", "", ""]);
  const [workHours, setWorkHours] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  console.log("checkInLocation : " + checkInLocation);
  console.log("checkOutLocation : " + checkOutLocation);

  useFocusEffect(
    useCallback(() => {
      async function fetchAttendance() {
        try {
          setIsLoading(true);
          const response = await axios.get(ATTENDANCE_URL, { params: { email: auth.user?.email } });
          setCheckIn(response.data.checkIn);
          setCheckOut(response.data.checkOut);
          setCheckInLocation(response.data.checkInLocation);
          setCheckOutLocation(response.data.checkOutLocation);
        } catch (error: any) {
          Alert.alert("🚨 서버 응답: " + error.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchAttendance();
    }, []),
  );

  useEffect(() => {
    setWorkHours(calculateWorkHours(checkIn, checkOut));
  }, [checkIn, checkOut]);

  useEffect(() => {
    setValidBeaconName(selectedLocation);
  }, [selectedLocation, setValidBeaconName]);

  const cleanupBeforeDate = getKoreaDate(subMonths(new Date(), 3));
  const cleanupScopeName = "모든 지점";

  if (isLoading) return <MyActivityIndicator />;

  async function CheckinForWork(attendanceIndex: number) {
    setIsLoading(true);

    if (await IsVaidArea()) {
      try {
        const timestamp = get24hTime();
        const response = await axios.post(ATTENDANCE_URL, {
          email: auth.user?.email,
          timestamp: timestamp,
          location: selectedLocation,
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
          setCheckInLocation((prev) => {
            const updatedCheckInLocation = [...prev];
            updatedCheckInLocation[attendanceIndex] = selectedLocation;
            return updatedCheckInLocation;
          });
          Alert.alert(`🕒 ${auth.user?.email} 님의 출근이 정상적으로 처리되었습니다.`);
        } else {
          Alert.alert(response.data.message);
        }
      } catch (error: any) {
        Alert.alert("🚨 서버 응답: " + error.message);
      }
    } else {
      Alert.alert("🚨 출근 실패", "올바른 위치에 있지 않습니다. 가게 근처로 이동해주세요.");
    }
    setIsLoading(false);
  }

  async function CheckoutForWork(attendanceIndex: number) {
    setIsLoading(true);
    if (await IsVaidArea()) {
      try {
        const timestamp = get24hTime();
        const response = await axios.post(ATTENDANCE_URL, {
          email: auth.user?.email,
          timestamp: timestamp,
          location: selectedLocation,
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
          setCheckOutLocation((prev) => {
            const updatedCheckOutLocation = [...prev];
            updatedCheckOutLocation[attendanceIndex] = selectedLocation;
            return updatedCheckOutLocation;
          });
          Alert.alert(`🕒 ${auth.user?.email} 님의 퇴근이 정상적으로 처리되었습니다.`);
          setWorkHours(response.data.workHours);
        } else {
          Alert.alert(response.data.message);
        }
      } catch (error: any) {
        Alert.alert("🚨 서버 응답: " + error.message);
      }
    } else {
      Alert.alert("🚨 퇴근 실패", "올바른 위치에 있지 않습니다. 가게 근처로 이동해주세요.");
    }
    setIsLoading(false);
  }

  async function cleanupOldAttendanceRecords() {
    if (!auth.user?.isAdmin) {
      return;
    }

    if (!auth.token) {
      Alert.alert("관리자 인증 실패", "로그인 정보가 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.delete(ATTENDANCE_URL, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
        data: {
          beforeDate: cleanupBeforeDate,
        },
      });
      const deletedCount = response.data.deletedDocumentCount ?? response.data.deletedCount ?? 0;

      Alert.alert(
        "삭제 완료",
        deletedCount > 0
          ? `${cleanupScopeName}의 ${cleanupBeforeDate} 이전 근태 기록 ${deletedCount}건을 삭제했습니다.`
          : `${cleanupScopeName}의 ${cleanupBeforeDate} 이전 근태 기록이 없습니다.`,
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "근태 기록 삭제 중 오류가 발생했습니다.";
      Alert.alert("삭제 실패", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function confirmCleanupOldAttendanceRecords() {
    Alert.alert(
      "근태 기록 일괄 삭제",
      `${cleanupScopeName}의 ${cleanupBeforeDate} 이전 기록들을 모두 삭제 하겠습니까?`,
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "네",
          style: "destructive",
          onPress: () => {
            cleanupOldAttendanceRecords();
          },
        },
      ],
    );
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
                <View style={styles.radioItem}>
                  <RadioButton.Android value="5minGN" />
                  <Text>강남점</Text>
                </View>
                <View style={styles.radioItem}>
                  <RadioButton.Android value="5minSN" />
                  <Text>수내점</Text>
                </View>
              </View>
            </RadioButton.Group>
          </ScrollView>
          {auth.user?.isAdmin ? (
            <Button
              mode="outlined"
              icon="delete-sweep"
              onPress={confirmCleanupOldAttendanceRecords}
              style={styles.adminButton}
            >
              [관리자 기능: 모든 지점 3개월 이전 기록 삭제]
            </Button>
          ) : null}
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
                checkInLocation={checkInLocation}
                checkOutLocation={checkOutLocation}
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
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 3,
  },
  adminButton: {
    marginTop: 12,
    marginBottom: 12,
  },
});
