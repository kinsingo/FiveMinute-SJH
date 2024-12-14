"use client";
import React, { useReducer } from "react";
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
  const [actionData, formAction] = useActionState(updateDatabaseServerAction, {
    message: "",
    sub_message: "",
  });

  const [formData, dispatch] = useReducer(formDataReducer, rows);

  // "이전 데이터 불러오기" 버튼 클릭 핸들러
  const handleLoadPreviousData = async () => {
    try {
      const response = await fetch(fetchPreviousDataPath, {
        method: "GET",
      });
      const data = await response.json();
      dispatch({ type: "LOAD_DATA", payload: data });
    } catch (error) {
      console.error("Failed to load previous data:", error);
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
      <MKButton color={color} onClick={handleLoadPreviousData}>
        가장 최신 데이터 불러오기
      </MKButton>
      <Container>
        <Box my={3} />
        <form action={formAction}>
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
                  <MyHeaderTableCell>분류</MyHeaderTableCell>
                  <MyHeaderTableCell>항목</MyHeaderTableCell>
                  <MyHeaderTableCell>단위</MyHeaderTableCell>
                  <MyHeaderTableCell>재고량</MyHeaderTableCell>
                  <MyHeaderTableCell>발주 필요량</MyHeaderTableCell>
                  <TableCell>
                    <input
                      type="hidden"
                      name="collectionName"
                      value={collectionName}
                    />
                    <input
                      type="hidden"
                      name="redirectPath"
                      value={redirectPathAfterSuccessfulUpdate}
                    />
                  </TableCell>
                </TableRow>
              </MKBox>
              <TableBody>
                {formData.map((row: InventoryItem & { isEdited?: boolean }, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: row.isEdited ? "white" : "#ffd", // 수정 상태에 따라 row 배경색 변경
                    }}
                  >
                    {/* ReadOnly 컬럼, input을 hidden 으로 해서 server 로 정보 전달 필요 */}
                    <MyTableCell
                      name={index.toString() + "#category"}
                      value={row.category}
                    />
                    <MyTableCell
                      name={index.toString() + "#item"}
                      value={row.item}
                    />
                    <MyTableCell
                      name={index.toString() + "#unit"}
                      value={row.unit}
                    />
                    {/* 수정 가능한 컬럼 */}
                    <TableCell>
                      <TextField
                        name={index.toString() + "#stock"}
                        type="text"
                        fullWidth
                        sx={{ pl: 4 }}
                        onChange={(e) =>
                          handleInputChange(index, "stock", e.target.value)
                        }
                        value={row.stock}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        name={index.toString() + "#requiredOrder"}
                        type="text"
                        fullWidth
                        sx={{ pl: 2 }}
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
                  </TableRow>
                ))}
              </TableBody>
            </MuiTable>
          </TableContainer>
          <Box my={3} textAlign="center" />
          <Box margin={"auto"} width={400}>
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
