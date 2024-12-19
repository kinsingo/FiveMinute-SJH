"use client";
import ResultPage from "./resultPage";
import {
  Column,
  Row,
} from "@/app/inventory/components/status/components/components/resultTable";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import DeleteStatusButton from "./deleteStatusBotton";
import { useState } from "react";

export default function StatusClientPage({
  currentUserEmail,
  mainText,
  color,
  fetchDeleteDataPath,
  latestDocument,
}: {
  currentUserEmail: string;
  mainText: string;
  color: MUIColor;
  fetchDeleteDataPath: string;
  latestDocument: any[];
}) {
  const [documents, setDocuments] = useState(latestDocument);

  const columns: Column[] = [
    { name: "분류", align: "center" },
    { name: "항목", align: "center" },
    { name: "단위", align: "center" },
    { name: "현재재고", align: "center" },
    { name: "발주필요", align: "center" },
    { name: "배송중", align: "center" },
  ];

  function getRows(document: any) {
    const rows: Row[] =
      document?.inventoryData.map((data: any) => ({
        분류: data.category || "N/A",
        항목: data.item || "N/A",
        단위: data.unit || "N/A",
        현재재고: data.stock || "N/A",
        발주필요: data.requiredOrder || "N/A",
        배송중: data.delivery || "N/A",
        hasBorder: true,
      })) || [];
    return rows;
  }

  function onDeleteSuccess(id: string) {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((doc) => doc._id !== id)
    );
  }

  return (
    <>
      <Box mt={5}>
        <Typography variant="h4" align="center" color={color}>
          {mainText}
        </Typography>
        {documents.map((document: any, index: number) => (
          <Box key={document._id || index} textAlign="center">
            <Box
              mt={3}
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="row"
              gap={2}
            >
              <Typography
                variant="h5"
                align="center"
                color={index === 0 ? color : undefined}
              >
                {index === 0 ? "가장 최신데이터" : `이전 데이터 (${index})`}
              </Typography>
              <DeleteStatusButton
                index={index}
                color={color}
                documentEmail={currentUserEmail}
                currentUserEmail={document.email}
                fetchDeleteDataPath={fetchDeleteDataPath}
                documentId={document._id.toString()}
                onDeleteSuccess={onDeleteSuccess}
              />
            </Box>
            <Typography
              mt={3}
              mx={3}
              variant="h5"
              align="center"
              color={index === 0 ? color : undefined}
            >
              {document.email} 님에 의해서 {document.timestamp} 에 업데이트
              되었습니다
            </Typography>
            <ResultPage columns={columns} rows={getRows(document)} />
          </Box>
        ))}
      </Box>
    </>
  );
}
