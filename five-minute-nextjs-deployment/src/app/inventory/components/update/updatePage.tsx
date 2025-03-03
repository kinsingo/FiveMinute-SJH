"use client";
import React, { useReducer, useState } from "react";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Container, TableCell, TextField } from "@mui/material";
import { useActionState } from "react";
import updateDatabaseServerAction from "./formAction";
import FormSubmit from "@/app/authentication/components/formSubmit";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MKBox from "@/MKcomponents/MKBox";
import MKTypography from "@/MKcomponents/MKTypography";
import ActionMessageDisplay from "@/app/authentication/components/ActionMessageDisplay";
import { MyHeaderTableCell, MyTableCell } from "./components/cells";
import rows from "./components/rows";
import InventoryItem from "./components/InventoryItem";
import MKButton from "@/MKcomponents/MKButton";
import formDataReducer from "./components/formDataReducer";
import { useMediaQuery } from "@mui/material";

export default function UpdatePage({
  collectionName,
  mainText,
  color,
  redirectPathAfterSuccessfulUpdate,
  fetchPreviousDataPath,
}: {
  collectionName: string;
  mainText: string;
  color: MUIColor;
  redirectPathAfterSuccessfulUpdate: string;
  fetchPreviousDataPath: string;
}) {
  const isSmallScreen = useMediaQuery("(max-width:768px)");

  const [actionData, formAction] = useActionState(updateDatabaseServerAction, {
    message: "",
    sub_message: "",
  });

  const [formData, dispatch] = useReducer(formDataReducer, rows);
  const [isLoading, setIsLoading] = useState(false); // Pending 상태 관리
  const [error, setError] = useState("");

  // "이전 데이터 불러오기" 버튼 클릭 핸들러
  const handleLoadPreviousData = async () => {
    setIsLoading(true); // 로딩 상태로 전환
    try {
      const response = await fetch(fetchPreviousDataPath, {
        method: "GET",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "데이터를 불러오는데 실패했습니다.");
        return;
      }
      const data = await response.json();
      dispatch({ type: "LOAD_DATA", payload: data });
    } catch (error) {
      setError("데이터를 불러오는데 실패했습니다. Error:" + error);
    } finally {
      setIsLoading(false); // 로딩 완료 후 상태 초기화
    }
  };

  // TextField 변경 핸들러
  const handleInputChange = (
    index: number,
    field: keyof InventoryItem,
    value: string | number
  ) => {
    dispatch({ type: "UPDATE_FIELD", payload: { index, field, value } });
  };

  return (
    <Box mt={5} textAlign="center">
      <Typography variant="h4" align="center" color={color}>
        {mainText}
      </Typography>
      <Box my={3} />
      <MKButton
        color={color}
        onClick={handleLoadPreviousData}
        disabled={isLoading} // 로딩 중이면 버튼 비활성화
      >
        {isLoading ? "불러오는중..." : "가장 최신 데이터 불러오기"}
      </MKButton>
      {error && (
        <Typography mt={2} color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Container>
        <Box my={3} />
        <form action={formAction}>
          {/* Hidden inputs for all rows */}
          {formData.map((row, index) => (
            <input
              type="hidden"
              name={`${index}#category`}
              value={row.category}
              key={`hidden-${index}`}
            />
          ))}
          <input type="hidden" name="collectionName" value={collectionName} />
          <input
            type="hidden"
            name="redirectPath"
            value={redirectPathAfterSuccessfulUpdate}
          />
          <TableContainer sx={{ maxHeight: 600 }}>
            <MuiTable stickyHeader aria-label="sticky table">
              <MKBox
                component="thead"
                bgColor="white"
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                }}
              >
                <TableRow>
                  {!isSmallScreen && (
                    <MyHeaderTableCell>분류</MyHeaderTableCell>
                  )}
                  <MyHeaderTableCell>항목</MyHeaderTableCell>
                  <MyHeaderTableCell>단위</MyHeaderTableCell>
                  <MyHeaderTableCell>현재재고</MyHeaderTableCell>
                  <MyHeaderTableCell>발주필요</MyHeaderTableCell>
                  <MyHeaderTableCell>배송중</MyHeaderTableCell>
                </TableRow>
              </MKBox>
              <TableBody
                sx={{
                  td: {
                    py: 0,
                  },
                  "@media (max-width: 768px)": {
                    td: {
                      py: 0,
                      px: 0,
                    },
                  },
                }}
              >
                {formData.map(
                  (
                    row: InventoryItem & { isEdited?: boolean },
                    index: number
                  ) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor: row.isEdited ? "white" : "#ffd", // 수정 상태에 따라 row 배경색 변경
                      }}
                    >
                      {/* ReadOnly 컬럼, input을 hidden 으로 해서 server 로 정보 전달 필요 */}
                      {!isSmallScreen && (
                        <MyTableCell
                          name={index.toString() + "#category"}
                          value={row.category}
                        />
                      )}
                      <MyTableCell
                        name={index.toString() + "#item"}
                        value={row.item}
                      />
                      <MyTableCell
                        name={index.toString() + "#unit"}
                        value={row.unit}
                      />
                      {/* 수정 가능한 컬럼 */}
                      <TableCell
                        sx={{
                          textAlign: "center", // 텍스트 중앙 정렬
                        }}
                      >
                        <TextField
                          name={index.toString() + "#stock"}
                          type="text"
                          fullWidth
                          sx={{ pl: 1 }}
                          onChange={(e) =>
                            handleInputChange(index, "stock", e.target.value)
                          }
                          value={row.stock}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center", // 텍스트 중앙 정렬
                        }}
                      >
                        <TextField
                          name={index.toString() + "#requiredOrder"}
                          type="text"
                          fullWidth
                          sx={{ pl: 1 }}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "requiredOrder",
                              e.target.value
                            )
                          }
                          value={row.requiredOrder}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center", // 텍스트 중앙 정렬
                        }}
                      >
                        <TextField
                          name={index.toString() + "#delivery"}
                          type="text"
                          fullWidth
                          sx={{ pl: 1 }}
                          onChange={(e) =>
                            handleInputChange(index, "delivery", e.target.value)
                          }
                          value={row.delivery}
                        />
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
          <Box my={3} textAlign="center" />
          <Box px={10}>
            <FormSubmit
              pendingText="sending data to database..."
              buttonText="update"
              color={color}
            />
            <MKTypography
              textAlign="center"
              display="block"
              variant="button"
              mt={2}
            >
              {actionData && (
                <ActionMessageDisplay
                  message={actionData.message}
                  sub_message={actionData.sub_message}
                />
              )}
            </MKTypography>
          </Box>
        </form>
      </Container>
    </Box>
  );
}
