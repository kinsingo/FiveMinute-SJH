import { useEffect, useState } from "react";
import { subscribeToCalendarEventsByDate } from "../services/calendar-firestore";
import { CalendarEvent, CalendarLocationProp } from "../types";

export function useCalendarEventsByDate(dateKey: string, location: CalendarLocationProp) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const unsubscribe = subscribeToCalendarEventsByDate({
      location,
      dateKey,
      onNext: (nextEvents) => {
        setEvents(nextEvents);
        setIsLoading(false);
      },
      onError: (nextError) => {
        setError(nextError.message);
        setIsLoading(false);
      },
    });

    return unsubscribe;
  }, [dateKey, location]);

  return {
    events,
    isLoading,
    error,
  };
}
