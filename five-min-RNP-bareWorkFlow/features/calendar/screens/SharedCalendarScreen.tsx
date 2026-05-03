import LoginRequired from "@/components/LoginRequired";
import CalendarEventForm from "@/features/calendar/components/CalendarEventForm";
import CalendarEventList from "@/features/calendar/components/CalendarEventList";
import { useCalendarEventDatesByMonth } from "@/features/calendar/hooks/useCalendarEventDatesByMonth";
import { useCalendarCurrentUser } from "@/features/calendar/hooks/useCalendarCurrentUser";
import { useCalendarEventsByDate } from "@/features/calendar/hooks/useCalendarEventsByDate";
import { deleteCalendarEventsBeforeDate } from "@/features/calendar/services/calendar-firestore";
import { formatDateToDateKey } from "@/features/calendar/utils/time";
import { subMonths } from "date-fns";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ActivityIndicator, Button, HelperText, Text, useTheme } from "react-native-paper";
import {
  CalendarKoreanPlaceName,
  CalendarLocationProp,
  getCalendarKoreanPlaceName,
} from "../types";

export default function SharedCalendarScreen({
  location,
  placeName = getCalendarKoreanPlaceName(location),
}: {
  location: CalendarLocationProp;
  placeName?: CalendarKoreanPlaceName;
}) {
  const router = useRouter();
  const theme = useTheme();
  const currentUser = useCalendarCurrentUser();
  const [selectedDateKey, setSelectedDateKey] = useState(formatDateToDateKey(new Date()));
  const [visibleMonthKey, setVisibleMonthKey] = useState(selectedDateKey);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const { events, isLoading, error } = useCalendarEventsByDate(selectedDateKey, location);
  const eventDateKeys = useCalendarEventDatesByMonth(visibleMonthKey, location);
  const cleanupBeforeDateKey = useMemo(() => formatDateToDateKey(subMonths(new Date(), 3)), []);

  const markedDates = useMemo(() => {
    const monthMarks = eventDateKeys.reduce<Record<string, { marked: boolean; dotColor: string }>>(
      (accumulator, dateKey) => {
        accumulator[dateKey] = {
          marked: true,
          dotColor: theme.colors.primary,
        };
        return accumulator;
      },
      {},
    );

    return {
      ...monthMarks,
      [selectedDateKey]: {
        ...monthMarks[selectedDateKey],
        selected: true,
        selectedColor: theme.colors.primary,
        dotColor: theme.colors.onPrimary,
        marked: monthMarks[selectedDateKey]?.marked ?? events.length > 0,
      },
    };
  }, [eventDateKeys, events.length, selectedDateKey, theme.colors.onPrimary, theme.colors.primary]);

  if (!currentUser) {
    return <LoginRequired title="공유 캘린더" router={router} />;
  }

  const handleCleanup = () => {
    Alert.alert(
      "일정 일괄 삭제",
      `${placeName}의 ${cleanupBeforeDateKey} 이전 기록들을 모두 삭제 하겠습니까?`,
      [
        {
          text: "아니오",
          style: "cancel",
        },
        {
          text: "네",
          style: "destructive",
          onPress: async () => {
            try {
              setIsCleaningUp(true);
              const deletedCount = await deleteCalendarEventsBeforeDate({
                location,
                beforeDateKey: cleanupBeforeDateKey,
              });
              Alert.alert(
                "삭제 완료",
                deletedCount > 0
                  ? `${placeName}의 ${cleanupBeforeDateKey} 이전 일정 ${deletedCount}건을 삭제했습니다.`
                  : `${placeName}의 ${cleanupBeforeDateKey} 이전 일정이 없습니다.`,
              );
            } catch (cleanupError) {
              console.error("Calendar cleanup failed:", cleanupError);
              Alert.alert("삭제 실패", "일정 정리 중 오류가 발생했습니다.");
            } finally {
              setIsCleaningUp(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall">{placeName} 공유 캘린더</Text>
        <Text variant="bodyMedium" style={styles.description}>
          월 캘린더에서 날짜를 선택하고, 아래에서 {placeName} 일정을 실시간으로 등록하고 확인합니다.
        </Text>
      </View>

      <Calendar
        onDayPress={(day: DateData) => setSelectedDateKey(day.dateString)}
        onMonthChange={(month: DateData) => setVisibleMonthKey(month.dateString)}
        markedDates={markedDates}
        theme={{
          arrowColor: theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.primary,
          dotColor: theme.colors.primary,
        }}
        style={styles.calendar}
      />

      <CalendarEventForm
        currentUser={currentUser}
        location={location}
        selectedDateKey={selectedDateKey}
      />

      {currentUser.role === "admin" ? (
        <Button
          mode="outlined"
          icon="delete-sweep"
          loading={isCleaningUp}
          disabled={isCleaningUp}
          onPress={handleCleanup}
          style={styles.adminButton}
          textColor={theme.colors.error}
        >
          [관리자 기능: 3개월 이전 기록 삭제]
        </Button>
      ) : null}

      <View style={styles.listHeader}>
        <Text variant="titleMedium">{selectedDateKey} 일정</Text>
      </View>

      <HelperText type="error" visible={!!error}>
        {error || " "}
      </HelperText>

      {isLoading ? (
        <ActivityIndicator style={styles.loading} />
      ) : (
        <CalendarEventList currentUser={currentUser} events={events} location={location} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  description: {
    marginTop: 8,
  },
  calendar: {
    borderRadius: 16,
    overflow: "hidden",
  },
  adminButton: {
    marginTop: 16,
  },
  listHeader: {
    marginTop: 20,
  },
  loading: {
    marginTop: 24,
  },
});
