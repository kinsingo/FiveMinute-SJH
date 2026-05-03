import { Alert } from "@mui/material";

export default function AttendanceAlerts() {
  return (
    <>
      <Alert severity="warning">
        다음 조건 중 하나라도 만족하는 경우, 해당 행은 오랜지색으로 표시됩니다.
        <ul style={{ marginTop: 4, marginBottom: 4 }}>
          <li>1. 근무 시간이 조회 기간의 하위 10% 이하인 경우</li>
          <li>
            2. 출근 기록 수가 퇴근 기록보다 많은 경우 (출근했으나 퇴근하지 않음)
          </li>
        </ul>
      </Alert>
      <Alert severity="error" sx={{ mt: 1 }}>
        다음 조건 중 하나라도 만족하는 경우, 해당 행은 붉은색으로 표시됩니다
        (근태 수정 필요시, 김나령님에게 요청하세요).
        <ul style={{ marginTop: 4, marginBottom: 4 }}>
          <li>
            1. 출/퇴근 시간이 시간:분:초 조건을 만족하지 않을 경우 (수정 오류)
          </li>
          <li>2. 퇴근 시간이 출근 시간보다 빠른 경우 (수정 오류)</li>
          <li>3. 퇴근 기록 수가 출근 기록보다 많은 경우 (수정 오류)</li>
        </ul>
      </Alert>
    </>
  );
}
