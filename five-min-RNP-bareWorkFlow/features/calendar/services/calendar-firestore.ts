import { db } from "@/firebase/services";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  serverTimestamp,
  updateDoc,
  writeBatch,
  where,
} from "firebase/firestore";
import {
  CalendarEvent,
  CalendarLocationProp,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from "../types";
import { assertCalendarTimeRange, parseTimeToMinutes } from "../utils/time";

type CalendarFirestorePatch = Record<string, string | number | ReturnType<typeof serverTimestamp>>;

function getCalendarCollectionName(location: CalendarLocationProp) {
  return `calendar-events-${location}`;
}

function toIsoString(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return undefined;
}

function getCalendarCollectionRef(location: CalendarLocationProp) {
  return collection(db, getCalendarCollectionName(location));
}

function mapCalendarEvent(
  snapshot: QueryDocumentSnapshot<DocumentData>,
  location: CalendarLocationProp,
): CalendarEvent {
  const data = snapshot.data();
  const startTime = typeof data.startTime === "string" ? data.startTime : "00:00";
  const endTime = typeof data.endTime === "string" ? data.endTime : "00:00";

  return {
    id: snapshot.id,
    author: {
      id: typeof data.author?.id === "string" ? data.author.id : "",
      name:
        typeof data.author?.name === "string" && data.author.name.length > 0
          ? data.author.name
          : "Unknown",
      email: typeof data.author?.email === "string" ? data.author.email : undefined,
      role: data.author?.role === "admin" ? "admin" : "staff",
    },
    dateKey: typeof data.dateKey === "string" ? data.dateKey : "",
    startTime,
    endTime,
    text: typeof data.text === "string" ? data.text : "",
    locationId:
      data.locationId === "Gangnam" || data.locationId === "Bundang" ? data.locationId : location,
    visibility: "team",
    startMinuteOfDay:
      typeof data.startMinuteOfDay === "number"
        ? data.startMinuteOfDay
        : parseTimeToMinutes(startTime),
    endMinuteOfDay:
      typeof data.endMinuteOfDay === "number" ? data.endMinuteOfDay : parseTimeToMinutes(endTime),
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  };
}

function sortCalendarEvents(events: CalendarEvent[]) {
  return [...events].sort(
    (left, right) =>
      left.startMinuteOfDay - right.startMinuteOfDay ||
      left.endMinuteOfDay - right.endMinuteOfDay ||
      left.id.localeCompare(right.id),
  );
}

export async function addCalendarEvent({
  location,
  input,
}: {
  location: CalendarLocationProp;
  input: CreateCalendarEventInput;
}) {
  assertCalendarTimeRange(input.startTime, input.endTime);

  const documentRef = await addDoc(getCalendarCollectionRef(location), {
    ...input,
    locationId: location,
    visibility: "team",
    startMinuteOfDay: parseTimeToMinutes(input.startTime),
    endMinuteOfDay: parseTimeToMinutes(input.endTime),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return documentRef.id;
}

export async function getCalendarEventsByDate({
  location,
  dateKey,
}: {
  location: CalendarLocationProp;
  dateKey: string;
}) {
  const calendarQuery = query(getCalendarCollectionRef(location), where("dateKey", "==", dateKey));
  const snapshot = await getDocs(calendarQuery);
  return sortCalendarEvents(
    snapshot.docs.map((docSnapshot) => mapCalendarEvent(docSnapshot, location)),
  );
}

export function subscribeToCalendarEventsByDate({
  location,
  dateKey,
  onNext,
  onError,
}: {
  location: CalendarLocationProp;
  dateKey: string;
  onNext: (events: CalendarEvent[]) => void;
  onError?: (error: Error) => void;
}) {
  const calendarQuery = query(getCalendarCollectionRef(location), where("dateKey", "==", dateKey));

  return onSnapshot(
    calendarQuery,
    (snapshot) => {
      onNext(
        sortCalendarEvents(
          snapshot.docs.map((docSnapshot) => mapCalendarEvent(docSnapshot, location)),
        ),
      );
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export function subscribeToCalendarEventsByDateRange({
  location,
  startDateKey,
  endDateKey,
  onNext,
  onError,
}: {
  location: CalendarLocationProp;
  startDateKey: string;
  endDateKey: string;
  onNext: (events: CalendarEvent[]) => void;
  onError?: (error: Error) => void;
}) {
  const calendarQuery = query(
    getCalendarCollectionRef(location),
    where("dateKey", ">=", startDateKey),
    where("dateKey", "<=", endDateKey),
  );

  return onSnapshot(
    calendarQuery,
    (snapshot) => {
      onNext(
        sortCalendarEvents(
          snapshot.docs.map((docSnapshot) => mapCalendarEvent(docSnapshot, location)),
        ),
      );
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export async function updateCalendarEvent({
  location,
  eventId,
  updates,
}: {
  location: CalendarLocationProp;
  eventId: string;
  updates: UpdateCalendarEventInput;
}) {
  const patch: CalendarFirestorePatch = {
    updatedAt: serverTimestamp(),
  };

  if (updates.dateKey !== undefined) {
    patch.dateKey = updates.dateKey;
  }

  if (updates.text !== undefined) {
    patch.text = updates.text;
  }

  if (updates.locationId !== undefined) {
    patch.locationId = updates.locationId;
  }

  if (updates.startTime !== undefined || updates.endTime !== undefined) {
    if (!updates.startTime || !updates.endTime) {
      throw new Error("시간을 수정할 때는 시작/종료 시간을 함께 보내야 합니다.");
    }

    assertCalendarTimeRange(updates.startTime, updates.endTime);
    patch.startTime = updates.startTime;
    patch.endTime = updates.endTime;
    patch.startMinuteOfDay = parseTimeToMinutes(updates.startTime);
    patch.endMinuteOfDay = parseTimeToMinutes(updates.endTime);
  }

  await updateDoc(doc(db, getCalendarCollectionName(location), eventId), patch);
}

export async function deleteCalendarEvent({
  location,
  eventId,
}: {
  location: CalendarLocationProp;
  eventId: string;
}) {
  await deleteDoc(doc(db, getCalendarCollectionName(location), eventId));
}

export async function deleteCalendarEventsBeforeDate({
  location,
  beforeDateKey,
}: {
  location: CalendarLocationProp;
  beforeDateKey: string;
}) {
  const calendarQuery = query(
    getCalendarCollectionRef(location),
    where("dateKey", "<", beforeDateKey),
  );
  const snapshot = await getDocs(calendarQuery);

  if (snapshot.empty) {
    return 0;
  }

  let deletedCount = 0;

  for (let index = 0; index < snapshot.docs.length; index += 400) {
    const batch = writeBatch(db);
    const docsChunk = snapshot.docs.slice(index, index + 400);

    docsChunk.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });

    await batch.commit();
    deletedCount += docsChunk.length;
  }

  return deletedCount;
}
