import { format } from "date-fns";

const timePattern = /^\d{2}:\d{2}$/;

export function formatDateToDateKey(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatDateToTimeLabel(date: Date) {
  return format(date, "HH:mm");
}

export function buildTimeDate(time: string) {
  const [hourText, minuteText] = time.split(":");
  const date = new Date();
  date.setHours(Number(hourText) || 0, Number(minuteText) || 0, 0, 0);
  return date;
}

export function parseTimeToMinutes(time: string) {
  if (!timePattern.test(time)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(`Invalid time value: ${time}`);
  }

  return hour * 60 + minute;
}

export function assertCalendarTimeRange(startTime: string, endTime: string) {
  const startMinuteOfDay = parseTimeToMinutes(startTime);
  const endMinuteOfDay = parseTimeToMinutes(endTime);

  if (endMinuteOfDay <= startMinuteOfDay) {
    throw new Error("종료 시간은 시작 시간보다 늦어야 합니다.");
  }
}
