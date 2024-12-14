import { useMemo } from "react";

// uuid is a library for generating unique id
import { v4 as uuidv4 } from "uuid";

// @mui material components
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

// Material Kit 2 PRO React components
import MKBox from "@/MKcomponents/MKBox";
import MKAvatar from "@/MKcomponents/MKAvatar";
import MKTypography from "@/MKcomponents/MKTypography";

// Define types for columns and rows
export interface Column {
  name: string;
  align?: "left" | "center" | "right";
  width?: string | number;
}

export interface Row {
  [key: string]: any;
  hasBorder?: boolean;
}

export interface TableProps {
  columns: Column[];
  rows: Row[];
}

export default function ResultTable({ columns = [], rows = [{}] }: TableProps) {
  const renderColumns = columns.map(({ name, align, width }, key) => {
    let pl;
    let pr;

    if (key === 0) {
      pl = 3;
      pr = 3;
    } else if (key === columns.length - 1) {
      pl = 3;
      pr = 3;
    } else {
      pl = 1;
      pr = 1;
    }

    return (
      <MKBox
        key={name}
        component="th"
        width={width || "auto"}
        pt={1.5}
        pb={1.25}
        pl={align === "left" ? pl : 3}
        pr={align === "right" ? pr : 3}
        textAlign={align}
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
        {name.toUpperCase()}
      </MKBox>
    );
  });

  const renderRows = rows.map((row, key) => {
    const rowKey = `row-${key}`;

    const tableRow = columns.map(({ name, align }) => {
      let template;

      if (Array.isArray(row[name])) {
        template = (
          <MKBox
            key={uuidv4()}
            component="td"
            p={1}
            sx={({ borders: { borderWidth, borderColor } }) => ({
              borderBottom: row.hasBorder
                ? `${borderWidth[1]} solid ${borderColor}`
                : 0,
            })}
          >
            <MKBox display="flex" alignItems="center" py={0.5} px={1}>
              <MKBox mr={2}>
                <MKAvatar
                  src={row[name][0]}
                  name={row[name][1]}
                  variant="rounded"
                  size="sm"
                />
              </MKBox>
              <MKTypography
                variant="button"
                fontWeight="medium"
                sx={{ width: "max-content" }}
              >
                {row[name][1]}
              </MKTypography>
            </MKBox>
          </MKBox>
        );
      } else {
        template = (
          <MKBox
            key={uuidv4()}
            component="td"
            p={1}
            textAlign={align}
            sx={({ borders: { borderWidth, borderColor } }) => ({
              borderBottom: row.hasBorder
                ? `${borderWidth[1]} solid ${borderColor}`
                : 0,
            })}
          >
            <MKTypography
              variant="button"
              fontWeight="regular"
              color="secondary"
              sx={{ display: "inline-block", width: "max-content" }}
            >
              {row[name]}
            </MKTypography>
          </MKBox>
        );
      }

      return template;
    });

    return <TableRow key={rowKey}>{tableRow}</TableRow>;
  });

  return useMemo(
    () => (
      <TableContainer sx={{ maxHeight: 440 }}>
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
            <TableRow>{renderColumns}</TableRow>
          </MKBox>
          <TableBody>{renderRows}</TableBody>
        </MuiTable>
      </TableContainer>
    ),
    [columns, rows]
  );
}


