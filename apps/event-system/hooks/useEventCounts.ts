import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type EventCounts = {
  companyCounts: Record<string, number>;
  reservationCounts: Record<string, number>;
  attendedCounts: Record<string, number>;
};

/**
 * イベントの登録企業数と予約学生数を取得するカスタムフック
 */
export function useEventCounts() {
  const fetchEventCounts = useCallback(
    async (eventIds: string[]): Promise<EventCounts> => {
      const supabase = createClient();
      const companyCounts: Record<string, number> = {};
      const reservationCounts: Record<string, number> = {};
      const attendedCounts: Record<string, number> = {};

      if (eventIds.length === 0) {
        return { companyCounts, reservationCounts, attendedCounts };
      }

      // 登録企業数を取得
      const { data: companyData, error: companyError } = await supabase
        .from("event_companies")
        .select("event_id")
        .in("event_id", eventIds);

      if (!companyError && companyData) {
        companyData.forEach((item) => {
          companyCounts[item.event_id] =
            (companyCounts[item.event_id] || 0) + 1;
        });
      }

      // 予約学生数を取得
      const { data: reservationData, error: reservationError } = await supabase
        .from("event_reservations")
        .select("event_id, attended")
        .in("event_id", eventIds);

      if (!reservationError && reservationData) {
        reservationData.forEach((item) => {
          reservationCounts[item.event_id] =
            (reservationCounts[item.event_id] || 0) + 1;
          // 出席登録済み（着座）の数をカウント
          if (item.attended) {
            attendedCounts[item.event_id] =
              (attendedCounts[item.event_id] || 0) + 1;
          }
        });
      }

      return { companyCounts, reservationCounts, attendedCounts };
    },
    []
  );

  return { fetchEventCounts };
}

