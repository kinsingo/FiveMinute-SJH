import {
  deleteCalendarEvent,
  updateCalendarEvent,
} from "@/features/calendar/services/calendar-firestore";
import { CalendarEvent, CalendarLocationProp, CalendarUser } from "@/features/calendar/types";
import {
  assertCalendarTimeRange,
  buildTimeDate,
  formatDateToTimeLabel,
} from "@/features/calendar/utils/time";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Card, Chip, HelperText, Text, TextInput } from "react-native-paper";

type PickerTarget = "start" | "end" | null;

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "일정을 처리하지 못했습니다.";
}

function CalendarEventItem({
  currentUser,
  event,
  location,
}: {
  currentUser: CalendarUser;
  event: CalendarEvent;
  location: CalendarLocationProp;
}) {
  const isMine = event.author.id === currentUser.id;
  const canManage = isMine || currentUser.role === "admin";
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(event.text);
  const [startTime, setStartTime] = useState(event.startTime);
  const [endTime, setEndTime] = useState(event.endTime);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetEditState() {
    setText(event.text);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setError(null);
    setPickerTarget(null);
  }

  function handleEditPress() {
    resetEditState();
    setIsEditing(true);
  }

  function handleEditCancel() {
    resetEditState();
    setIsEditing(false);
  }

  function handlePickerConfirm(date: Date) {
    const nextTime = formatDateToTimeLabel(date);

    if (pickerTarget === "start") {
      setStartTime(nextTime);
    }

    if (pickerTarget === "end") {
      setEndTime(nextTime);
    }

    setPickerTarget(null);
  }

  async function handleSave() {
    if (!text.trim()) {
      setError("일정 내용을 입력해 주세요.");
      return;
    }

    try {
      assertCalendarTimeRange(startTime, endTime);
      setIsSubmitting(true);
      setError(null);
      await updateCalendarEvent({
        location,
        eventId: event.id,
        updates: {
          text: text.trim(),
          startTime,
          endTime,
        },
      });
      setIsEditing(false);
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      setIsSubmitting(true);
      await deleteCalendarEvent({ location, eventId: event.id });
    } catch (deleteError) {
      Alert.alert("삭제 실패", getErrorMessage(deleteError));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDeleteConfirm() {
    Alert.alert("일정 삭제", "정말로 삭제 하겠습니까?", [
      {
        text: "아니오",
        style: "cancel",
      },
      {
        text: "예",
        style: "destructive",
        onPress: () => {
          void handleDelete();
        },
      },
    ]);
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.headerRow}>
          <Text variant="titleMedium">
            {isEditing ? `${startTime} - ${endTime}` : `${event.startTime} - ${event.endTime}`}
          </Text>
          <Chip compact>{isMine ? "내 일정" : event.author.name}</Chip>
        </View>

        {isEditing ? (
          <>
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
            />
            <HelperText type="error" visible={!!error}>
              {error || " "}
            </HelperText>
            <View style={styles.actionRow}>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                저장
              </Button>
              <Button mode="text" onPress={handleEditCancel} disabled={isSubmitting}>
                취소
              </Button>
            </View>
          </>
        ) : (
          <>
            <Text variant="bodyLarge" style={styles.bodyText}>
              {event.text}
            </Text>
            <Text variant="bodySmall" style={styles.metaText}>
              작성자: {event.author.name}
            </Text>
            <Text variant="bodySmall" style={styles.metaText}>
              권한: {event.author.role === "admin" ? "관리자" : "직원"}
            </Text>
            {canManage ? (
              <View style={styles.actionRow}>
                <Button mode="text" onPress={handleEditPress} disabled={isSubmitting}>
                  수정
                </Button>
                <Button
                  mode="text"
                  textColor="#b3261e"
                  onPress={handleDeleteConfirm}
                  disabled={isSubmitting}
                >
                  삭제
                </Button>
              </View>
            ) : null}
          </>
        )}
      </Card.Content>
      <DateTimePickerModal
        isVisible={pickerTarget !== null}
        mode="time"
        date={buildTimeDate(pickerTarget === "end" ? endTime : startTime)}
        onConfirm={handlePickerConfirm}
        onCancel={() => setPickerTarget(null)}
      />
    </Card>
  );
}

export default function CalendarEventList({
  currentUser,
  events,
  location,
}: {
  currentUser: CalendarUser;
  events: CalendarEvent[];
  location: CalendarLocationProp;
}) {
  if (events.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Card.Content>
          <Text variant="bodyMedium">등록된 일정이 없습니다.</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {events.map((event) => (
        <CalendarEventItem
          key={event.id}
          currentUser={currentUser}
          event={event}
          location={location}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  emptyCard: {
    marginTop: 12,
  },
  card: {
    marginTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  bodyText: {
    marginTop: 12,
  },
  metaText: {
    marginTop: 8,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
});
