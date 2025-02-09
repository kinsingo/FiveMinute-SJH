import { View, StyleSheet, Alert } from "react-native";
import { Attendance } from "../listOfAttendance";
import { getWorkingHours } from "./utils";
import { useState } from "react";
import { Text, Card, Button } from "react-native-paper";
import AttendanceModificationModal from "./attendanceModificationModal";

export default function RenderedCard({
  attendance,
  onAttendanceUpdate,
}: {
  attendance: Attendance;
  onAttendanceUpdate: (updatedAttendance: Attendance) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date(attendance.start));
  const [endDate, setEndDate] = useState(new Date(attendance.end));

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const extractTime = (date: Date) => date.getHours() * 60 + date.getMinutes();

  const handleStartTimeConfirm = (date: Date) => {
    const newStartTime = extractTime(date);
    const endTime = extractTime(endDate);

    if (newStartTime < endTime) {
      setStartDate((prev) => {
        const updatedDate = new Date(prev);
        updatedDate.setHours(date.getHours());
        updatedDate.setMinutes(date.getMinutes());
        return updatedDate;
      });
    } else {
      Alert.alert(
        "유효하지 않은 시간",
        "출근 시간은 퇴근 시간보다 빨라야 없습니다.",
        [{ text: "확인" }]
      );
    }
  };

  const handleEndTimeConfirm = (date: Date) => {
    const startTime = extractTime(startDate);
    const newEndTime = extractTime(date);
    if (newEndTime > startTime) {
      setEndDate((prev) => {
        const updatedDate = new Date(prev);
        updatedDate.setHours(date.getHours());
        updatedDate.setMinutes(date.getMinutes());
        return updatedDate;
      });
    } else {
      Alert.alert(
        "유효하지 않은 시간",
        "퇴근 시간은 출근 시간보다 늦어야 합니다.",
        [{ text: "확인" }]
      );
    }
  };

  const handleSave = () => {
    onAttendanceUpdate({ start: startDate, end: endDate });
    closeModal();
  };

  return (
    <Card style={styles.CardContainer}>
      <View style={styles.CardView}>
        <Card.Content>
          <Text>출근:{attendance.start.toLocaleString()}</Text>
          <Text>퇴근:{attendance.end.toLocaleString()}</Text>
          <Text>
            시간:
            {getWorkingHours(attendance)}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={openModal}>
            수정
          </Button>
        </Card.Actions>
      </View>

      <AttendanceModificationModal
        visible={visible}
        onStartTimeConfirm={handleStartTimeConfirm}
        onEndTimeConfirm={handleEndTimeConfirm}
        onSave={handleSave}
        onCancel={() => setVisible(false)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  CardContainer: {
    marginHorizontal: 24,
    marginVertical: 5,
    paddingVertical: 10,
  },
  CardView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
