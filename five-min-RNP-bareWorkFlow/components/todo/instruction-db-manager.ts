//instruction-manager.ts
import { db } from "@/firebase/services";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { getTimeStamp } from "@/util/time-manager";

export interface Instruction {
  id: string;
  title: string;
  author: string;
  email: string;
  timestamp: string;
  details: string;
  imageUrl: string;
}

export interface CommentProps {
  id: string;
  content: string;
  author: string;
  email: string;
  timestamp: string;
  realTime: string;
  commentImageUrl: string;
}

export type LocationProp = "Bundang" | "Gangnam" | "Sinlim";
export type koreanPlaceName = "강남점" | "수내점" | "관악점";

export function getkoreanPlaceName(Location: LocationProp) :koreanPlaceName{
  switch (Location) {
    case "Bundang":
      return "수내점";
    case "Gangnam":
      return "강남점";
    case "Sinlim":
      return "관악점";
  }
};


const getTopLevelCollectionName = (Location: LocationProp) => {
  return "instructions-" + Location;
};

const getSubCollectionName = (Location: LocationProp) => {
  return "comments-" + Location;
};

// Firestore 데이터 추가 함수
export const addInstruction = async ({
  Location,
  instruction,
}: {
  Location: LocationProp;
  instruction: Instruction;
}) => {
  try {
    await addDoc(collection(db, getTopLevelCollectionName(Location)), instruction);
  } catch (error) {
    console.error("🔥 Firestore 저장 에러:", error);
  }
};

export const addInstructionComments = async ({
  id,
  Location,
  newComment,
}: {
  id: string;
  Location: LocationProp;
  newComment: CommentProps;
}) => {
  try {
    await addDoc(
      collection(
        db,
        getTopLevelCollectionName(Location),
        id as string,
        getSubCollectionName(Location)
      ),
      newComment
    );
  } catch (error) {
    console.error("🔥 Firestore 저장 에러:", error);
  }
};

export const getInstructionCommentsQuery = ({
  id,
  Location,
}: {
  id: string;
  Location: LocationProp;
}) => {
  const commentsRef = collection(
    db,
    getTopLevelCollectionName(Location),
    id as string,
    getSubCollectionName(Location)
  );
  return query(commentsRef, orderBy("timestamp", "desc")); // 최신 댓글이 위로 오도록 정렬
};

// Firestore에서 데이터 불러오기 (이거 getTimstamp()기준으로 정렬해서 가져오도록)
export const getInstructions = async ({ Location }: { Location: LocationProp }) => {
  try {
    const queryResult = query(
      collection(db, getTopLevelCollectionName(Location)),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(queryResult);
    const instructions: Instruction[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        author: data.author,
        email: data.email,
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
export const updateInstruction = async ({
  id,
  Location,
  details,
}: {
  id: string;
  Location: LocationProp;
  details: string;
}) => {
  try {
    const updatedData = { details, date: getTimeStamp() };
    const instructionRef = doc(db, getTopLevelCollectionName(Location), id);
    await updateDoc(instructionRef, updatedData);
  } catch (error) {
    console.error("🔥 Firestore 업데이트 에러:", error);
  }
};

// Firestore 문서 삭제 함수
export const deleteInstruction = async ({
  id,
  Location,
}: {
  id: string;
  Location: LocationProp;
}) => {
  try {
    await deleteDoc(doc(db, getTopLevelCollectionName(Location), id));
  } catch (error) {
    console.error("🔥 Firestore 삭제 에러:", error);
  }
};

// Firestore 문서 삭제 함수
export const deleteInstructionComment = async ({
  instructionId, // ✅ 지시사항 문서 ID
  commentId, // ✅ 삭제할 댓글의 문서 ID
  Location,
}: {
  instructionId: string;
  commentId: string;
  Location: LocationProp;
}) => {
  try {
    await deleteDoc(
      doc(
        db,
        getTopLevelCollectionName(Location), // 🔹 "instructions-Bundang"
        instructionId, // 🔹 지시사항 문서 ID
        getSubCollectionName(Location), // 🔹 "comments-Bundang"
        commentId // ✅ 삭제할 댓글 문서 ID
      )
    );
  } catch (error) {
    console.error("🔥 Firestore 삭제 에러:", error);
  }
};
