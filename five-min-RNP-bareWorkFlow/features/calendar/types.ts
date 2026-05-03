export type CalendarRole = "admin" | "staff";
export type CalendarLocationProp = "Bundang" | "Gangnam";
export type CalendarKoreanPlaceName = "강남점" | "수내점";

export function getCalendarKoreanPlaceName(
  location: CalendarLocationProp,
): CalendarKoreanPlaceName {
  switch (location) {
    case "Gangnam":
      return "강남점";
    case "Bundang":
      return "수내점";
  }
}

export interface CalendarUser {
  id: string;
  email: string;
  name: string;
  role: CalendarRole;
  position?: string;
}

export interface CalendarEventAuthor {
  id: string;
  name: string;
  email?: string;
  role: CalendarRole;
}

export interface CalendarEvent {
  id: string;
  author: CalendarEventAuthor;
  dateKey: string;
  startTime: string;
  endTime: string;
  text: string;
  locationId: CalendarLocationProp;
  visibility: "team";
  startMinuteOfDay: number;
  endMinuteOfDay: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCalendarEventInput {
  author: CalendarEventAuthor;
  dateKey: string;
  startTime: string;
  endTime: string;
  text: string;
  locationId?: CalendarLocationProp;
}

export interface UpdateCalendarEventInput {
  dateKey?: string;
  startTime?: string;
  endTime?: string;
  text?: string;
  locationId?: CalendarLocationProp;
}
