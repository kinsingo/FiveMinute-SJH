export function getTimeStamp() {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

export function get24hTime() {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24시간 형식 유지
  }).format(new Date());
}

export function getTodayDate() {
  return getKoreaDate(new Date());
}

export function getDateBeforeDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days); // 🔹 현재 날짜에서 `days`만큼 빼기
  return getKoreaDate(date);
}

export function getKoreaDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(date)
      .replace(/\. /g, "-")
      .replace(/\.$/, "");
  }


//Web쪽 Backend API도 동일한 함수 사용하여 Workhours 계산 및 DB저장함
//건들지 말것 ! 혹시 수정 필요하면 Web/App 같이 수정
export function calculateWorkHours(checkIn: string[], checkOut: string[]): number {
  let totalSeconds = 0;

  for (let i = 0; i < checkIn.length; i++) {
    if (!checkIn[i] || !checkOut[i]) continue; // 빈 값이면 건너뜀

    const checkInParts = checkIn[i].split(":").map((num) => parseInt(num, 10));
    const checkOutParts = checkOut[i].split(":").map((num) => parseInt(num, 10));

    if (checkInParts.length !== 3 || checkOutParts.length !== 3) continue; // 형식이 맞지 않으면 무시

    const [inHour, inMinute, inSecond] = checkInParts;
    const [outHour, outMinute, outSecond] = checkOutParts;

    // ✅ 총 초 단위로 변환하여 차이 계산
    const checkInTotalSeconds = inHour * 3600 + inMinute * 60 + inSecond;
    const checkOutTotalSeconds = outHour * 3600 + outMinute * 60 + outSecond;

    totalSeconds += checkOutTotalSeconds - checkInTotalSeconds;
  }

  return totalSeconds / 3600; // ✅ 초 → 시간 변환
}