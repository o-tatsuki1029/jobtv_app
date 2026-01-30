"use client";

import { useRouter } from "next/navigation";
import { type Event } from "@/lib/actions/session-entry-actions";

interface EventSelectionProps {
  events: Event[];
  isLoading: boolean;
  selectedEventId: string;
  onSelect: (id: string) => void;
}

function formatTime(time: string | undefined | null): string {
  if (!time) return "";
  return time.slice(0, 5);
}

function formatEventDisplay(event: Event): string {
  const dateObj = new Date(event.event_date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"][dateObj.getDay()];

  const startTime = formatTime(event.start_time);
  const endTime = formatTime(event.end_time);

  return `${month}月 ${day}日 (${dayOfWeek}) ${startTime} ~ ${endTime}`;
}

export function EventSelection({ events, isLoading, selectedEventId, onSelect }: EventSelectionProps) {
  const router = useRouter();

  return (
    <div className="mb-8 sm:mb-10">
      <div className="h-50 overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/50 sm:bg-gray-50/30">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">読み込み中...</div>
        ) : events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
            現在、受付中のイベントはありません
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {events.map((event) => {
              const isSelected = selectedEventId === event.id;
              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    onSelect(event.id);
                    router.push(`/event/entry?eventId=${event.id}`, {
                      scroll: false
                    });
                  }}
                  className={`w-full text-left px-4 py-4 hover:bg-white transition-all flex items-center gap-4 ${
                    isSelected ? "bg-white z-10" : "text-gray-600"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? "border-red-500 bg-white" : "border-gray-300"
                    }`}
                  >
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                  </div>

                  <div className="flex-1">
                    <div className={`text-sm tracking-wide ${isSelected ? "font-bold text-gray-900" : "font-medium"}`}>
                      {formatEventDisplay(event)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
