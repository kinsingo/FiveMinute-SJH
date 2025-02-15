import { useFocusEffect } from "expo-router";
import React, { useState, useCallback, useContext } from "react";
import { Alert} from "react-native";
import { AuthContext } from "@/store/context/AuthContext";
import axios from "axios";
import AttendanceTable, { AttendanceData } from "../../components/attendance/AttendanceTable";
import MyActivityIndicator from "@/components/MyActivityIndicator";

const ATTENDANCE_URL = "https://www.5minbowl.com/api/attendance";

export default function main() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const auth = useContext(AuthContext);
  const email = auth.user?.email;
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function fetchAttendanceList() {
        try {
          setIsLoading(true);
          const response = await axios.get(ATTENDANCE_URL, {
            params: { email },
          });
          setAttendanceData(response.data);
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "서버 오류가 발생했습니다.";
          Alert.alert(`⚠️ ${errorMessage}`);
        } finally {
          setIsLoading(false);
        }
      }
      fetchAttendanceList();
    }, [])
  );

  if(isLoading)
    return <MyActivityIndicator />;

  return <AttendanceTable attendanceData={attendanceData} />;
  //return <ListOfAttendance attendanceList={DummyAttendanceList} />;
}
