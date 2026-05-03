import { Box, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function AttendanceTableFilter({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  hourlyWage,
  setHourlyWage,
}: {
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  hourlyWage: number;
  setHourlyWage: (wage: number) => void;
}) {
  return (
    <Box flexDirection="row" display="flex">
      <DatePicker
        label="시작 날짜"
        value={startDate}
        onChange={setStartDate}
        slotProps={{
          textField: {
            fullWidth: false,
            InputLabelProps: {
              shrink: true,
            },
          },
        }}
      />
      <Box sx={{ ml: 2 }} />
      <DatePicker
        label="종료 날짜"
        value={endDate}
        onChange={setEndDate}
        slotProps={{
          textField: {
            fullWidth: false,
            InputLabelProps: {
              shrink: true,
            },
          },
        }}
      />
      <Box sx={{ ml: 2 }} />
      <TextField
        value={hourlyWage}
        onChange={(event) => setHourlyWage(Number(event.target.value))}
        label="시급"
        variant="outlined"
      />
    </Box>
  );
}
