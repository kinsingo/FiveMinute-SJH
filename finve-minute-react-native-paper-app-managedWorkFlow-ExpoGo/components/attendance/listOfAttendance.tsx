import { View, FlatList, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import RenderedCard from "./components/renderedCard";
import { calculateTotalHours } from "./components/utils";
import { useState } from "react";

export interface Attendance {
  start: Date;
  end: Date;
}

export default function ListOfAttendance({
  attendanceList,
}: {
  attendanceList: Attendance[];
}) {
  const { colors } = useTheme();
  const [attendances, setAttendances] = useState(attendanceList);

  const handleAttendanceUpdate = (
    index: number,
    updatedAttendance: Attendance
  ) => {
    const updatedAttendances = [...attendances];
    updatedAttendances[index] = updatedAttendance;
    setAttendances(updatedAttendances);
  };

  return (
    <View>
      <View
        style={[
          styles.HeadContainer,
          { backgroundColor: colors.primaryContainer, marginBottom: 5 },
        ]}
      >
        <Text variant="headlineMedium">
          지난 {attendanceList.length} 일간의 근태 결과
        </Text>
        <Text variant="bodyLarge">
          총 일한 시간 : {calculateTotalHours(attendances)} 시간
        </Text>
      </View>
      <FlatList
        data={attendances}
        renderItem={({ item, index }) => (
          <RenderedCard
            attendance={item}
            onAttendanceUpdate={(updatedAttendance) =>
              handleAttendanceUpdate(index, updatedAttendance)
            }
          />
        )}
        keyExtractor={(item, index) => `${index}-${item.start.toISOString()}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  HeadContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 50,
    marginHorizontal: 24,
  },
});
