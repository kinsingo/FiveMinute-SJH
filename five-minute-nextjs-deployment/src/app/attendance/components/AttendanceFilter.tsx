"use client";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import MKButton from "@/MKcomponents/MKButton";
import MKTypography from "@/MKcomponents/MKTypography";
import { Autocomplete } from "@mui/material";
import Box from "@mui/material/Box";

interface AttendanceFilterProps {
  setAttendanceData: (data: any) => void;
}

export default function AttendanceFilter({
  setAttendanceData,
}: AttendanceFilterProps) {
  const [selectedEmail, setSelectedEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  // 사용자 이메일 목록 가져오기
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (!response.ok) {
          setMessage(`⚠️ "사용자 데이터를 불러오는데 실패했습니다."`);
          setIsError(true);
          return;
        }
        // users 배열에서 email 필드만 추출하여 상태 업데이트
        setEmails(data.map((user: { email: string }) => user.email));
        setSelectedEmail(data[0].email);
      } catch (error: any) {
        setMessage(`⚠️ ${error.message}`);
        setIsError(true);
      }
    };

    fetchEmails();
  }, []);

  const handleFilter = async () => {
    setMessage(null);
    setIsError(false);

    if (!selectedEmail.trim()) {
      setMessage("⚠️ 이메일을 입력하세요.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(`/api/attendance?email=${selectedEmail}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "서버 오류가 발생했습니다.");
      }
      setAttendanceData(data);
      setMessage(`✔️ ${selectedEmail}님의 근태 데이터를 불러왔습니다.`);
    } catch (error: any) {
      setMessage(`⚠️ ${error.message}`);
      setIsError(true);
    }
  };

  const messageColor = isError ? "error" : "success";

  return (
    <div>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Autocomplete
          options={emails}
          value={selectedEmail}
          onChange={(_, newValue) => setSelectedEmail(newValue as string)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="사용자 선택"
              variant="outlined"
              inputProps={{ ...params.inputProps, readOnly: true }} // 입력 필드 Readonly 설정
            />
          )}
          sx={{ width: 300 }}
          disableClearable={true} // "X" 버튼 비활성화
        />
        <MKButton color="info" sx={{ ml: 2 }} onClick={handleFilter}>
          검색
        </MKButton>
      </Box>
      {message && (
        <MKTypography color={messageColor} sx={{ mt: 1 }}>
          {message}
        </MKTypography>
      )}
    </div>
  );
}
