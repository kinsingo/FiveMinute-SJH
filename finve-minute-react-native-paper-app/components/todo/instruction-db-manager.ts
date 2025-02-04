//instruction-manager.ts
import { db } from "@/firebase/services";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from "firebase/firestore";
import { getTimeStamp } from "@/util/time-manager";

export interface Instruction {
  id: string;
  title: string;
  author: string;
  timestamp: string;
  details: string;
  imageUrl: string;
}

const collectionName = "instructions";

// Firestore 데이터 추가 함수
export const addInstruction = async (instruction: Instruction) => {
  try {
    await addDoc(collection(db, collectionName), instruction);
  } catch (error) {
    console.error("🔥 Firestore 저장 에러:", error);
  }
};

// Firestore에서 데이터 불러오기 (이거 getTimstamp()기준으로 정렬해서 가져오도록)
export const getInstructions = async () => {
  try {
    const queryResult = query(collection(db, collectionName), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(queryResult);
    const instructions: Instruction[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        author: data.author,
        timestamp: data.timestamp,
        details: data.details,
        imageUrl: data.imageUrl,
      };
    });
    return instructions;
  } catch (error) {
    console.error("🔥 Firestore 읽기 에러:", error);
    return [];
  }
};

// Firestore 문서 업데이트 함수
export const updateInstruction = async (id: string, details: string) => {
  try {
    const updatedData = { details, date: getTimeStamp() };
    const instructionRef = doc(db, collectionName, id);
    await updateDoc(instructionRef, updatedData);
  } catch (error) {
    console.error("🔥 Firestore 업데이트 에러:", error);
  }
};

// Firestore 문서 삭제 함수
export const deleteInstruction = async (id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error("🔥 Firestore 삭제 에러:", error);
  }
};
