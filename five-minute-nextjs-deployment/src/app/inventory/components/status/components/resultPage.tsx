"use client";
import ResultTable from "../../../../../components/resultTable";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { motion, AnimatePresence } from "framer-motion";
import { TableProps } from "../../../../../components/resultTable";
import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import categories from "./components/categories";

export default function ResultPage({ columns, rows }: TableProps) {
  const [selectedValue, setSelectedValue] = React.useState(categories[0]);
  const [modifiedRows, setModifiedRows] = React.useState(rows);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    const filteredRows = rows.filter((row: any) => {
      if (event.target.value === "전부 다 보기") {
        return true;
      } else {
        return row.분류 === event.target.value;
      }
    });
    setModifiedRows(filteredRows);
  };

  return (
    <Box py={2}>
      <Container>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={selectedValue} // 현재 선택된 값을 설정합니다.
          onChange={handleChange} // 선택이 변경될 때 호출되는 핸들러를 설정합니다.
        >
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              value={category}
              control={<Radio />}
              label={category}
            />
          ))}
        </RadioGroup>
        <Stack spacing={2} pt={2}>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3 }}
            >
              <ResultTable columns={columns} rows={modifiedRows} />
            </motion.div>
          </AnimatePresence>
        </Stack>
      </Container>
    </Box>
  );
}
