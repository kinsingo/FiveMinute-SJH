export function getKoreaTodayDate() {
    return getKoreaDate(new Date());
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