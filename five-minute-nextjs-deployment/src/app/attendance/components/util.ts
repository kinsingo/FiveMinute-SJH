export function calculateWorkHours(
  checkIn: string[],
  checkOut: string[]
): number {
  let totalSeconds = 0;

  for (let i = 0; i < checkIn.length; i++) {
    if (!checkIn[i] || !checkOut[i]) continue; // 빈 값이면 건너뜀

    const checkInParts = checkIn[i].split(":").map((num) => parseInt(num, 10));
    const checkOutParts = checkOut[i]
      .split(":")
      .map((num) => parseInt(num, 10));

    if (checkInParts.length !== 3 || checkOutParts.length !== 3) continue; // 형식이 맞지 않으면 무시

    const [inHour, inMinute, inSecond] = checkInParts;
    const [outHour, outMinute, outSecond] = checkOutParts;

    // ✅ 총 초 단위로 변환하여 차이 계산
    const checkInTotalSeconds = inHour * 3600 + inMinute * 60 + inSecond;
    const checkOutTotalSeconds = outHour * 3600 + outMinute * 60 + outSecond;

    if (checkOutTotalSeconds < checkInTotalSeconds) {
      continue; // 퇴근 시간이 출근 시간보다 빠르면 무시, 관련 에러 보이는거는, AttendanceTable.tsx에서 처리
    }

    totalSeconds += checkOutTotalSeconds - checkInTotalSeconds;
  }

  return totalSeconds / 3600; // ✅ 초 → 시간 변환
}

export function isValidCheckInCheckOut(
  checkIn: string,
  checkOut: string
): boolean {
  const timeRegex = /^\d{1,2}:\d{1,2}:\d{1,2}$/; // \d{1,2} =>	숫자(0~9) 1자리 또는 2자리 (예: 1, 09, 59)
  if (!timeRegex.test(checkIn) || !timeRegex.test(checkOut)) return false; //"HH:MM:SS"처럼 시간 형식 문자열만 허용함 (알파벳방지)

  const checkInParts = checkIn.split(":").map((num) => parseInt(num, 10));
  const checkOutParts = checkOut.split(":").map((num) => parseInt(num, 10));

  // ✅ 총 초 단위로 변환하여 차이 계산
  const [inHour, inMinute, inSecond] = checkInParts;
  const [outHour, outMinute, outSecond] = checkOutParts;

  // 출/퇴근 시간이 숫자가 아니거나 음수이면 에러
  if (
    [inHour, inMinute, inSecond, outHour, outMinute, outSecond].some(
      (v) => isNaN(v) || v < 0
    )
  )
    return false;

  // 출/퇴근 시간이 24:00:00이 아니면, 23:59:59까지만 허용
  if (
    (inHour > 23 || inMinute > 59 || inSecond > 59) &&
    !(inHour === 24 && inMinute === 0 && inSecond === 0)
  ) {
    return false;
  }
  if (
    (outHour > 23 || outMinute > 59 || outSecond > 59) &&
    !(outHour === 24 && outMinute === 0 && outSecond === 0)
  ) {
    return false;
  }

  const checkInTotalSeconds = inHour * 3600 + inMinute * 60 + inSecond;
  const checkOutTotalSeconds = outHour * 3600 + outMinute * 60 + outSecond;
  if (checkOutTotalSeconds < checkInTotalSeconds) return false; // 퇴근 시간이 출근 시간보다 빠르면 에러

  return true; // ✅ 유효한 출퇴근 시간
}
