"use client";
import { useState } from "react";
import { TextField } from "@mui/material";
import MKButton from "@/MKcomponents/MKButton";
import MKTypography from "@/MKcomponents/MKTypography";

interface AttendanceFilterProps {
  setAttendanceData: (data: any) => void;
}

export default function AttendanceFilter({
  setAttendanceData,
}: AttendanceFilterProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleFilter = async () => {
    setMessage(null);
    setIsError(false);

    if (!email.trim()) {
      setMessage("⚠️ 이메일을 입력하세요.");
      setIsError(true);
      return;
    }

    try {
      const response = await fetch(`/api/attendance?email=${email}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "서버 오류가 발생했습니다.");
      }
      setAttendanceData(data);
      setMessage(`✔️ ${email}님의 근태 데이터를 불러왔습니다.`);
    } catch (error: any) {
      setMessage(`⚠️ ${error.message}`);
      setIsError(true);
    }
  };

  const messageColor = isError ? "error" : "success";

  return (
    <div>
      <TextField
        label="이메일 검색"
        variant="outlined"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <MKButton color="info" sx={{ ml: 2 }} onClick={handleFilter}>
        검색
      </MKButton>
      {message && (
        <MKTypography color={messageColor} sx={{ mt: 1 }}>
          {message}
        </MKTypography>
      )}
    </div>
  );
}
