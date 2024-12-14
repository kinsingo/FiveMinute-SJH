import React from "react";
import { TableCell } from "@mui/material";

import MKTypography from "@/MKcomponents/MKTypography";

export function MyTableCell({ name, value }: { name: string; value: string }) {
  return (
    <TableCell
      sx={{
        textAlign: "center", // 텍스트 중앙 정렬
        padding: "0px", // 셀 간격 줄이기
      }}
    >
      <MKTypography
        variant="button"
        fontWeight="medium"
        color="secondary"
        sx={{ display: "inline-block", width: "max-content" }}
      >
        {value}
      </MKTypography>
      <input type="hidden" name={name} value={value} />
    </TableCell>
  );
}

export function MyHeaderTableCell({ children }: { children: React.ReactNode }) {
  return (
    <TableCell
      sx={{
        textAlign: "center", // 텍스트 중앙 정렬
        padding: "0px", // 셀 간격 줄이기
      }}
    >
      <MKTypography
        variant="button"
        fontWeight="bold"
        color="secondary"
        sx={{ display: "inline-block", width: "max-content" }}
      >
        {children}
      </MKTypography>
    </TableCell>
  );
}
