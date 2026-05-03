"use client";
import { useEffect, useState } from "react";
import AttendanceTable, { AttendanceData } from "./AttendanceTable";
import AttendanceFilter from "./AttendanceFilter";
import { Container, Typography, Card, CardContent, Box } from "@mui/material";
import AttendanceSummary from "./AttendanceSummary";
import MKTypography from "@/MKcomponents/MKTypography";
export interface User {
  email: string;
  realname?: string; // realname이 있을 수도 있고 없을 수도 있음
  isAdmin?: boolean; // isAdmin이 있을 수도 있고 없을 수도 있음
}

export default function Dashboard({ login_email }: { login_email: string }) {
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 사용자 이메일 목록 가져오기
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (!response.ok) {
          setMessage(`⚠️ "사용자 데이터를 불러오는데 실패했습니다."`);
          setIsError(true);
          return;
        }
        setUsers(data);
      } catch (error: any) {
        setMessage(`⚠️ ${error.message}`);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);
  const messageColor = isError ? "error" : "success";

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 3 }} textAlign="center">
        <Typography variant="h4" align="center" color="info" gutterBottom>
          근태 관리 대시보드
        </Typography>
        <AttendanceFilter
          setAttendanceData={setAttendanceData}
          users={users}
          isLoading={isLoading}
          setIsError={setIsError}
          setMessage={setMessage}
        />
        {message && (
          <MKTypography color={messageColor} sx={{ mt: 1 }}>
            {message}
          </MKTypography>
        )}
      </Box>
      <Card sx={{ mt: 3, pt: 2 }}>
        <CardContent>
          {!isError && (
            <AttendanceTable
              attendanceData={attendanceData}
              users={users}
              setIsError={setIsError}
              setMessage={setMessage}
              login_email={login_email}
            />
          )}
        </CardContent>
      </Card>

      <Card sx={{ mt: 3, pt: 2 }}>
        <CardContent>
          {!isError && <AttendanceSummary attendanceData={attendanceData} />}
        </CardContent>
      </Card>
    </Container>
  );
}
