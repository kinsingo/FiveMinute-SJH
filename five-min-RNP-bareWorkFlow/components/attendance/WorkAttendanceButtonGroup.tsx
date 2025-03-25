import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { validIbeaconE7Name } from "@/hooks/useScanBLEs";

interface WorkAttendanceButtonGroupProps {
  attendanceIndex: number;
  checkIn: string[];
  checkOut: string[];
  checkInLocation: string[];
  checkOutLocation: string[];
  onCheckIn: (index: number) => void;
  onCheckOut: (index: number) => void;
}

function getLocationName(location: validIbeaconE7Name) {
  switch (location) {
    case "5minGN":
      return "강남점";
    case "5minSN":
      return "수내점";
    case "5minSL":
      return "관악점";
    default:
      return `${location}(오류)`;
  }
}

const WorkAttendanceButtonGroup: React.FC<WorkAttendanceButtonGroupProps> = ({
  attendanceIndex,
  checkIn,
  checkOut,
  checkInLocation,
  checkOutLocation,
  onCheckIn,
  onCheckOut,
}) => {
  if (
    attendanceIndex > 0 &&
    (!checkIn[attendanceIndex - 1].trim() || !checkOut[attendanceIndex - 1].trim())
  ) {
    return null; // 이전 출근/퇴근이 완료되지 않으면 렌더링 안 함
  }

  return (
    <View style={styles.radioContainer}>
      <Button
        onPress={() => onCheckIn(attendanceIndex)}
        mode="contained"
        icon="briefcase-check"
        style={styles.button}
        disabled={checkIn[attendanceIndex].trim() !== ""}
      >
        {attendanceIndex + 1}번째 출근 {checkIn[attendanceIndex]}{" "}
        {checkInLocation[attendanceIndex] &&
          getLocationName(checkInLocation[attendanceIndex] as validIbeaconE7Name)}
      </Button>
      <Button
        onPress={() => onCheckOut(attendanceIndex)}
        mode="elevated"
        icon="logout"
        style={styles.button}
        disabled={checkIn[attendanceIndex].trim() === "" || checkOut[attendanceIndex].trim() !== ""}
      >
        {attendanceIndex + 1}번째 퇴근 {checkOut[attendanceIndex]}{" "}
        {checkOutLocation[attendanceIndex] &&
          getLocationName(checkOutLocation[attendanceIndex] as validIbeaconE7Name)}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    marginBottom: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    width: "100%",
    marginVertical: 5,
  },
});

export default WorkAttendanceButtonGroup;
