import { db } from "@/firebase/services";
import { PHONE_ORDER_MENU_SEED } from "@/features/cost-calculator/data/phone-order-menu-seed";
import { PhoneOrderMenu, PhoneOrderMenuInput } from "@/features/cost-calculator/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  QueryDocumentSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

const PHONE_ORDER_MENUS_COLLECTION = "phoneOrderMenus";
const PHONE_ORDER_METADATA_COLLECTION = "appMetadata";
const PHONE_ORDER_SEED_DOC_ID = "phoneOrderMenusSeed";

function getPhoneOrderMenusCollectionRef() {
  return collection(db, PHONE_ORDER_MENUS_COLLECTION);
}

function getPhoneOrderSeedMetadataRef() {
  return doc(db, PHONE_ORDER_METADATA_COLLECTION, PHONE_ORDER_SEED_DOC_ID);
}

function normalizeMenuInput(input: PhoneOrderMenuInput): PhoneOrderMenuInput {
  return {
    category: input.category.trim(),
    name: input.name.trim(),
    price: Math.trunc(input.price),
  };
}

function assertValidMenuInput(input: PhoneOrderMenuInput) {
  if (!input.category) {
    throw new Error("카테고리를 입력해 주세요.");
  }

  if (!input.name) {
    throw new Error("메뉴명을 입력해 주세요.");
  }

  if (!Number.isInteger(input.price) || input.price <= 0) {
    throw new Error("가격은 1원 이상의 숫자로 입력해 주세요.");
  }
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

function mapPhoneOrderMenu(snapshot: QueryDocumentSnapshot<DocumentData>): PhoneOrderMenu {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    category: typeof data.category === "string" ? data.category : "",
    name: typeof data.name === "string" ? data.name : "",
    price: typeof data.price === "number" ? data.price : 0,
    updatedAt: toIsoString(data.updatedAt),
  };
}

function sortPhoneOrderMenus(menus: PhoneOrderMenu[]) {
  return [...menus].sort(
    (left, right) =>
      left.category.localeCompare(right.category, "ko") ||
      left.name.localeCompare(right.name, "ko") ||
      left.price - right.price ||
      left.id.localeCompare(right.id),
  );
}

function createSeedDocumentId(index: number) {
  return `seed-${String(index + 1).padStart(3, "0")}`;
}

export async function ensurePhoneOrderMenusSeeded() {
  const metadataSnapshot = await getDoc(getPhoneOrderSeedMetadataRef());

  if (metadataSnapshot.data()?.initialized === true) {
    return;
  }

  const existingMenusSnapshot = await getDocs(query(getPhoneOrderMenusCollectionRef(), limit(1)));

  if (!existingMenusSnapshot.empty) {
    await setDoc(
      getPhoneOrderSeedMetadataRef(),
      {
        initialized: true,
        source: "existing-data",
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return;
  }

  const batch = writeBatch(db);

  PHONE_ORDER_MENU_SEED.forEach((item, index) => {
    const normalizedItem = normalizeMenuInput(item);

    batch.set(doc(db, PHONE_ORDER_MENUS_COLLECTION, createSeedDocumentId(index)), {
      ...normalizedItem,
      updatedAt: serverTimestamp(),
    });
  });

  batch.set(
    getPhoneOrderSeedMetadataRef(),
    {
      initialized: true,
      source: "json-seed",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await batch.commit();
}

export function subscribeToPhoneOrderMenus({
  onNext,
  onError,
}: {
  onNext: (menus: PhoneOrderMenu[]) => void;
  onError?: (error: Error) => void;
}) {
  return onSnapshot(
    getPhoneOrderMenusCollectionRef(),
    (snapshot) => {
      onNext(
        sortPhoneOrderMenus(snapshot.docs.map((docSnapshot) => mapPhoneOrderMenu(docSnapshot))),
      );
    },
    (error) => {
      if (onError) {
        onError(error);
      }
    },
  );
}

export async function addPhoneOrderMenu(input: PhoneOrderMenuInput) {
  const normalizedInput = normalizeMenuInput(input);
  assertValidMenuInput(normalizedInput);

  const documentRef = await addDoc(getPhoneOrderMenusCollectionRef(), {
    ...normalizedInput,
    updatedAt: serverTimestamp(),
  });

  return documentRef.id;
}

export async function updatePhoneOrderMenu({
  menuId,
  input,
}: {
  menuId: string;
  input: PhoneOrderMenuInput;
}) {
  const normalizedInput = normalizeMenuInput(input);
  assertValidMenuInput(normalizedInput);

  await updateDoc(doc(db, PHONE_ORDER_MENUS_COLLECTION, menuId), {
    ...normalizedInput,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePhoneOrderMenu(menuId: string) {
  await deleteDoc(doc(db, PHONE_ORDER_MENUS_COLLECTION, menuId));
}
