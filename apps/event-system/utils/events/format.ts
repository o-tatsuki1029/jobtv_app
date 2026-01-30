import { formatTime } from "@/utils/format/index";
import type { EventWithCounts } from "@/utils/sort/events";

/**
 * イベントデータを表示用にフォーマットする関数
 */
export function formatEventData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[],
  companyCounts: Record<string, number>,
  reservationCounts: Record<string, number>,
  attendedCounts: Record<string, number>
): EventWithCounts[] {
  return events.map((event) => ({
    ...event,
    start_time: formatTime(event.start_time),
    end_time: formatTime(event.end_time),
    company_count: companyCounts[event.id] || 0,
    reservation_count: reservationCounts[event.id] || 0,
    attended_count: attendedCounts[event.id] || 0,
  })) as EventWithCounts[];
}

