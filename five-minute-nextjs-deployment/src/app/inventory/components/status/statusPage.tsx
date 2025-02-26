import { getPublicCollection } from "@/MongoDB/db-manager";
import { auth } from "@/app/api/auth/next-auth";
import StatusClientPage from "./components/statusClientPage";

export default async function StatusPage({
  collectionName,
  mainText,
  color,
  fetchDeleteDataPath,
}: {
  collectionName: string;
  mainText: string;
  color: MUIColor;
  fetchDeleteDataPath: string;
}) {
  const session = await auth();
  const currentUserEmail = session?.user?.email || "";
  console.log("currentUserEmail:", currentUserEmail);

  const collection = await getPublicCollection(collectionName);

  // 가장 최신 데이터 가져오기
  const latestDocument = await collection
    .find({})
    .sort({ timestamp: -1 }) // timestamp 기준 내림차순 정렬
    .limit(3)
    .toArray();

  // _id를 문자열로 변환 (ObjectId -> string), 이렇게 해야 Client Side 로 전달 가능함
  const sanitizedDocuments = latestDocument.map((doc) => ({
    ...doc,
    _id: doc._id.toString(), // ObjectId를 문자열로 변환
  }));

  return (
    <StatusClientPage
      currentUserEmail={currentUserEmail}
      mainText={mainText}
      color={color}
      fetchDeleteDataPath={fetchDeleteDataPath}
      latestDocument={sanitizedDocuments}
    />
  );
}
