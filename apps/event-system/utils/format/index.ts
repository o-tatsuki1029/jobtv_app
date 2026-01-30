/**
 * 日付を yyyy-mm-dd hh:mm:ss 形式にフォーマット
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 日付を yyyy-mm-dd 形式にフォーマット
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * 時間を HH:MM 形式にフォーマット
 * HH:MM:SS または HH:MM 形式を HH:MM に統一
 */
export function formatTime(time: string | undefined | null): string {
  if (!time) return "";
  return time.slice(0, 5);
}

/**
 * 今日の日付を yyyy-mm-dd 形式で取得
 */
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}


