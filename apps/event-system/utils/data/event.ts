import { Event } from "@/types/event.types";
import { formatTime } from "@/utils/format/index";

/**
 * イベント情報を表示用にフォーマット
 * パターン1: 日付 開始時刻〜終了時刻 エリア イベント名
 */
export function formatEventDisplay(event: Event & { 
  event_name?: string; 
  area?: string | null; 
  event_area?: string | null;
}): string {
  const eventName = event.event_name || "";
  const area = event.area || event.event_area || "";
  return `${event.event_date} ${formatTime(event.start_time)}〜${formatTime(event.end_time)} ${area} ${eventName}`;
}

/**
 * イベント情報を選択肢用にフォーマット
 * パターン2: 日付　開始時刻〜終了時刻　エリア - イベント名
 */
export function formatEventOption(event: Event & { 
  event_name?: string; 
  area?: string | null; 
  event_area?: string | null;
}): string {
  const eventName = event.event_name || "";
  const area = event.area || event.event_area || "";
  return `${event.event_date}　${formatTime(event.start_time)}〜${formatTime(event.end_time)}　${area} - ${eventName}`;
}

/**
 * イベントリストを今日以降と過去に分けてソート
 */
export function sortEventsByDate(events: Event[]): Event[] {
  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter((event) => event.event_date >= today);
  const pastEvents = events.filter((event) => event.event_date < today);

  return [...upcomingEvents, ...pastEvents];
}


