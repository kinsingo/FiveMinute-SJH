export function getKoreaTodayDate() {
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
