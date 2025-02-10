import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface WorkAttendanceButtonGroupProps {
  attendanceIndex: number;
  checkIn: string[];
  checkOut: string[];
  isScanning: boolean;
  onCheckIn: (index: number) => void;
  onCheckOut: (index: number) => void;
}

const WorkAttendanceButtonGroup: React.FC<WorkAttendanceButtonGroupProps> = ({
  attendanceIndex,
  checkIn,
  checkOut,
  isScanning,
  onCheckIn,
  onCheckOut,
}) => {
  if (attendanceIndex > 0 && (!checkIn[attendanceIndex - 1] || !checkOut[attendanceIndex - 1])) {
    return null; // 이전 출근/퇴근이 완료되지 않으면 렌더링 안 함
  }

  return (
    <View style={styles.radioContainer}>
      <Button
        onPress={() => onCheckIn(attendanceIndex)}
        mode="contained"
        icon="briefcase-check"
        style={styles.button}
        disabled={isScanning || checkIn[attendanceIndex] !== ""}
      >
        {attendanceIndex + 1}번째 출근 {checkIn[attendanceIndex]}
      </Button>
      <Button
        onPress={() => onCheckOut(attendanceIndex)}
        mode="elevated"
        icon="logout"
        style={styles.button}
        disabled={isScanning || checkOut[attendanceIndex] !== ""}
      >
        {attendanceIndex + 1}번째 퇴근 {checkOut[attendanceIndex]}
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
