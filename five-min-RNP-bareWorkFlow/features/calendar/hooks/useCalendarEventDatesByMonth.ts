import { subscribeToCalendarEventsByDateRange } from "@/features/calendar/services/calendar-firestore";
import { formatDateToDateKey } from "@/features/calendar/utils/time";
import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { CalendarLocationProp } from "../types";

export function useCalendarEventDatesByMonth(
  anchorDateKey: string,
  location: CalendarLocationProp,
) {
  const [eventDateKeys, setEventDateKeys] = useState<string[]>([]);

  const range = useMemo(() => {
    const anchorDate = new Date(`${anchorDateKey}T00:00:00`);

    return {
      startDateKey: formatDateToDateKey(startOfMonth(anchorDate)),
      endDateKey: formatDateToDateKey(endOfMonth(anchorDate)),
    };
  }, [anchorDateKey]);

  useEffect(() => {
    const unsubscribe = subscribeToCalendarEventsByDateRange({
      location,
      startDateKey: range.startDateKey,
      endDateKey: range.endDateKey,
      onNext: (events) => {
        setEventDateKeys([...new Set(events.map((event) => event.dateKey))]);
      },
      onError: () => {
        setEventDateKeys([]);
      },
    });

    return unsubscribe;
  }, [location, range.endDateKey, range.startDateKey]);

  return eventDateKeys;
}
