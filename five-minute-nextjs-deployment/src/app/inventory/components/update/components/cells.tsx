import React from "react";
import { TableCell } from "@mui/material";

import MKTypography from "@/MKcomponents/MKTypography";
import MKBox from "@/MKcomponents/MKBox";

export function MyTableCell({ name, value }: { name: string; value: string }) {
  return (
    <TableCell
      sx={{
        textAlign: "center", // 텍스트 중앙 정렬
      }}
    >
      <MKTypography
        variant="button"
        fontWeight="regular"
        color="secondary"
        sx={{ display: "inline-block", width: "max-content" }}
      >
        {value}
      </MKTypography>
      <input type="hidden" name={name} value={value} />
    </TableCell>
  );
}

//export function MyHeaderTableCell({ children }: { children: React.ReactNode }) {
//  return (
//    <TableCell
//      sx={{
//        textAlign: "center", // 텍스트 중앙 정렬
//      }}
//    >
//      <MKTypography
//        variant="button"
//        fontWeight="bold"
//        color="secondary"
//        sx={{ display: "inline-block", width: "max-content" }}
//      >
//        {children}
//      </MKTypography>
//    </TableCell>
//  );
//}
export function MyHeaderTableCell({ children }: { children: React.ReactNode }) {
  return (
    <MKBox
      component="th"
      width={"auto"}
      pt={1.5}
      pb={1.25}
      pl={2}
      pr={2}
      textAlign="center"
      color="secondary"
      sx={({
        typography: { fontWeightBold },
        borders: { borderWidth, borderColor },
      }) => ({
        fontSize: "0.75rem",
        fontWeight: fontWeightBold,
        borderBottom: `${borderWidth[1]} solid ${borderColor}`,
      })}
    >
      {children}
    </MKBox>
  );
}


