"use client";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import MKButton from "@/MKcomponents/MKButton";
import MKTypography from "@/MKcomponents/MKTypography";
import { Autocomplete } from "@mui/material";
import Box from "@mui/material/Box";
import { User } from "./DashBoard"; // User 타입을 가져옵니다.

interface AttendanceFilterProps {
  setAttendanceData: (data: any) => void;
  users: User[]; // 사용자 목록을 props로 받습니다.
  isLoading: boolean; // 로딩 상태를 props로 받습니다.
  setIsError: (isError: boolean) => void; // 에러 상태를 설정하는 함수
  setMessage: (message: string | null) => void; // 메시지를 설정하는 함수
}

export default function AttendanceFilter({
  setAttendanceData,
  users,
  isLoading,
  setIsError,
  setMessage,
}: AttendanceFilterProps) {
  const [selectedUser, setSelectedUser] = useState<User>(
    users.length > 0 ? users[0] : { email: "", realname: "", isAdmin: false }
  );
  const [isSearching, setIsSearching] = useState(false);
  // 사용자 이메일 목록 가져오기
  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [users]);

  const handleFilter = async () => {
    setMessage(null);
    setIsError(false);
    setIsSearching(true);
    setAttendanceData([]);

    if (!selectedUser || !selectedUser.email) {
      setMessage("⚠️ 사용자 선택 후 검색하세요.");
      setIsError(true);
      setIsSearching(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/attendance?email=${selectedUser.email}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "서버 오류가 발생했습니다.");
      }
      setAttendanceData(data);
      setMessage(
        `✔️ ${
          selectedUser.realname || selectedUser.email
        }님의 근태 데이터를 불러왔습니다.`
      );
    } catch (error: any) {
      setMessage(`⚠️ ${error.message}`);
      setIsError(true);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div>
      {isLoading && (
        <MKTypography color="info" sx={{ mt: 1 }}>
          데이터를 불러오는 중입니다.
        </MKTypography>
      )}
      {!isLoading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Autocomplete
            options={users}
            getOptionLabel={(option) => option.realname || option.email} // realname을 우선 사용
            value={selectedUser}
            onChange={(_, newValue) => setSelectedUser(newValue)}
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
            disabled={isSearching}
          />
          <MKButton
            color="info"
            sx={{ ml: 2 }}
            onClick={handleFilter}
            disabled={isSearching}
          >
            검색
          </MKButton>
        </Box>
      )}
    </div>
  );
}
