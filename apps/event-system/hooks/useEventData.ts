import { useState, useCallback } from "react";
import { useEventCounts } from "@/hooks/useEventCounts";
import { buildEventDataQuery, applyFilters } from "@/utils/events/query";
import { createClient } from "@/lib/supabase/client";
import {
  isCountSortKey,
  isClientSortKey,
  sortEventsByCount,
  sortEventsByClient,
  type EventWithCounts,
} from "@/utils/sort/events";
import { formatEventData } from "@/utils/events/format";
import { transformEventData, applyClientFilters } from "@/utils/events/transform";
import type { EventFilter } from "@/components/ui/table/EventFilters";

type UseEventDataParams = {
  filters: EventFilter;
  sortKey: string;
  sortAsc: boolean;
  page: number;
  pageSize: number;
};

type UseEventDataReturn = {
  events: EventWithCounts[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  fetchEvents: () => Promise<void>;
};

/**
 * イベントデータ取得のカスタムフック
 */
export function useEventData({
  filters,
  sortKey,
  sortAsc,
  page,
  pageSize,
}: UseEventDataParams): UseEventDataReturn {
  const [events, setEvents] = useState<EventWithCounts[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const { fetchEventCounts } = useEventCounts();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isCountSort = isCountSortKey(sortKey);
      const isClientSort = isClientSortKey(sortKey);
      const from = page * pageSize;
      const to = from + pageSize - 1;

      // エリアまたは卒年度のフィルターがある場合は全件取得が必要（クライアント側でフィルタリングするため）
      const hasClientFilter = !!filters.area || filters.graduationYear !== "";
      const needsFullData =
        isCountSort || isClientSort || hasClientFilter;

      // データ取得用のクエリを構築
      const query = buildEventDataQuery(
        filters,
        sortKey,
        sortAsc,
        needsFullData
      );

      // 全件取得が必要な場合は全件取得、そうでない場合はページング
      let rawData;
      let queryError;
      let totalCountFromQuery = 0;

      if (needsFullData) {
        const result = await query;
        rawData = result.data;
        queryError = result.error;
      } else {
        // ページングする場合でも、全件数を取得するために別のクエリを実行
        const supabase = createClient();
        let countQuery = supabase
          .from("events")
          .select("*", { count: "exact", head: true });
        countQuery = applyFilters(countQuery, filters);
        const countResult = await countQuery;
        
        // カウントクエリのエラーをチェック
        if (countResult.error) {
          console.error("カウント取得エラー:", countResult.error);
          // カウント取得エラーは警告として扱い、続行する
        } else {
          totalCountFromQuery = countResult.count || 0;
        }
        
        const result = await query.range(from, to);
        rawData = result.data;
        queryError = result.error;
      }

      // エラーがある場合のみ処理（空のオブジェクトは無視）
      if (queryError && (queryError.message || queryError.code || Object.keys(queryError).length > 0)) {
        console.error("取得エラー:", queryError);
        const errorMessage = queryError.message || queryError.code || "不明なエラー";
        setError(`イベントの取得に失敗しました: ${errorMessage}`);
        return;
      }

      if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        setEvents([]);
        setTotalCount(needsFullData ? 0 : totalCountFromQuery);
        return;
      }

      const eventIds = rawData.map((event) => event.id);

      // 登録企業数、予約学生数、着座数を取得
      const { companyCounts, reservationCounts, attendedCounts } =
        await fetchEventCounts(eventIds);

      // データ変換とフォーマット
      const transformedData = transformEventData(rawData);
      let formattedData = formatEventData(
        transformedData,
        companyCounts,
        reservationCounts,
        attendedCounts
      ) as Array<EventWithCounts & { area?: string | null; target_graduation_year?: number | null }>;

      // クライアント側でフィルター適用
      formattedData = applyClientFilters(formattedData, {
        area: filters.area || undefined,
        graduationYear: filters.graduationYear || undefined,
      }) as EventWithCounts[];

      // フィルター適用後の総件数を更新
      // needsFullDataがtrueの場合はフィルター適用後の長さ、falseの場合は全件数から推定
      if (needsFullData) {
        setTotalCount(formattedData.length);
      } else {
        // フィルター適用前の全件数から、フィルター適用後の件数を推定
        // 実際には正確な件数を取得するには全件取得が必要だが、パフォーマンスを考慮して
        // フィルター適用前の全件数を使用（日付フィルターのみ適用されている場合）
        setTotalCount(totalCountFromQuery);
      }

      // ソート処理
      if (isCountSort) {
        formattedData = sortEventsByCount(
          formattedData,
          sortKey as "company_count" | "reservation_count" | "attended_count",
          sortAsc
        );
      } else if (isClientSort) {
        formattedData = sortEventsByClient(
          formattedData,
          sortKey as "target_graduation_year" | "area" | "event_name",
          sortAsc
        );
      }

      // ページング適用（needsFullDataがtrueの場合のみ、クライアント側でページング）
      // needsFullDataがfalseの場合は、既にサーバー側でページング済みなのでスライス不要
      if (needsFullData) {
        formattedData = formattedData.slice(from, to + 1);
      }

      setEvents(formattedData);
    } catch (err) {
      console.error("予期しないエラー:", err);
      setError("予期しないエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortKey, sortAsc, page, pageSize, fetchEventCounts]);

  return {
    events,
    isLoading,
    error,
    totalCount,
    fetchEvents,
  };
}

