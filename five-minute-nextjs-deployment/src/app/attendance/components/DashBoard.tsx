"use client";
import { useState } from "react";
import AttendanceTable, { AttendanceData } from "./AttendanceTable";
import AttendanceFilter from "./AttendanceFilter";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import AttendanceSummary from "./AttendanceSummary";

export default function Dashboard() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3 }} textAlign="center">
        <Typography variant="h4" align="center" color="info" gutterBottom>
          근태 관리 대시보드
        </Typography>
        <AttendanceFilter setAttendanceData={setAttendanceData} />
      </Box>

      <Card sx={{ mt: 3, pt:2 }}>
        <CardContent>
          <AttendanceTable attendanceData={attendanceData} />
        </CardContent>
      </Card>

      <Card sx={{ mt: 3, pt:2 }}>
        <CardContent>
          <AttendanceSummary attendanceData={attendanceData} />
        </CardContent>
      </Card>
    </Container>
  );
}
