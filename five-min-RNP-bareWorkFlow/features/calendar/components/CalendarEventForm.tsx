import { addCalendarEvent } from "@/features/calendar/services/calendar-firestore";
import { CalendarLocationProp, CalendarUser } from "@/features/calendar/types";
import {
  assertCalendarTimeRange,
  buildTimeDate,
  formatDateToTimeLabel,
} from "@/features/calendar/utils/time";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Card, HelperText, Text, TextInput } from "react-native-paper";

type PickerTarget = "start" | "end" | null;

const defaultStartTime = "09:00";
const defaultEndTime = "10:00";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "일정을 저장하지 못했습니다.";
}

export default function CalendarEventForm({
  currentUser,
  location,
  selectedDateKey,
}: {
  currentUser: CalendarUser;
  location: CalendarLocationProp;
  selectedDateKey: string;
}) {
  const [text, setText] = useState("");
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!text.trim()) {
      setError("일정 내용을 입력해 주세요.");
      return;
    }

    try {
      assertCalendarTimeRange(startTime, endTime);
      setIsSaving(true);
      setError(null);
      await addCalendarEvent({
        location,
        input: {
          dateKey: selectedDateKey,
          startTime,
          endTime,
          text: text.trim(),
          author: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
          },
        },
      });
      setText("");
      Alert.alert("공유 캘린더", "일정이 저장되었습니다.");
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSaving(false);
    }
  }

  function handleConfirm(date: Date) {
    const nextTime = formatDateToTimeLabel(date);

    if (pickerTarget === "start") {
      setStartTime(nextTime);
    }

    if (pickerTarget === "end") {
      setEndTime(nextTime);
    }

    setPickerTarget(null);
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{selectedDateKey} 일정 등록</Text>
        <Text variant="bodySmall" style={styles.metaText}>
          작성자: {currentUser.name}
        </Text>
        <View style={styles.timeRow}>
          <Button mode="outlined" onPress={() => setPickerTarget("start")}>
            시작 {startTime}
          </Button>
          <Button mode="outlined" onPress={() => setPickerTarget("end")}>
            종료 {endTime}
          </Button>
        </View>
        <TextInput
          mode="outlined"
          label="일정 내용"
          multiline
          value={text}
          onChangeText={setText}
          placeholder="예: 점심 교대, 발주 확인, 주간 회의"
        />
        <HelperText type="error" visible={!!error}>
          {error || " "}
        </HelperText>
        <Button mode="contained" onPress={handleSubmit} loading={isSaving} disabled={isSaving}>
          일정 저장
        </Button>
      </Card.Content>
      <DateTimePickerModal
        isVisible={pickerTarget !== null}
        mode="time"
        date={buildTimeDate(pickerTarget === "end" ? endTime : startTime)}
        onConfirm={handleConfirm}
        onCancel={() => setPickerTarget(null)}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
  },
  metaText: {
    marginTop: 4,
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
});
