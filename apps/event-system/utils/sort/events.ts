import { Event } from "@/types/event.types";
import { sortByCountField, isCountSortKey as isCountSortKeyGeneric } from "@/utils/sort/index";

export type EventWithCounts = Event & {
  company_count: number;
  reservation_count: number;
  attended_count: number;
  // イベントタイプマスタから取得するフィールド
  target_graduation_year?: number | null;
  area?: string | null;
  event_name?: string;
};

// カウント項目のキー
const COUNT_SORT_KEYS = [
  "company_count",
  "reservation_count",
  "attended_count",
] as const;

// クライアント側でソートする必要があるキー（イベントタイプマスタから取得するフィールド）
const CLIENT_SORT_KEYS = [
  "target_graduation_year",
  "area",
  "event_name",
] as const;

export type CountSortKey = typeof COUNT_SORT_KEYS[number];
export type ClientSortKey = typeof CLIENT_SORT_KEYS[number];

/**
 * ソートキーがカウント項目かどうかを判定
 */
export function isCountSortKey(key: string): key is CountSortKey {
  return isCountSortKeyGeneric(key, COUNT_SORT_KEYS);
}

/**
 * ソートキーがクライアント側でソートする必要がある項目かどうかを判定
 */
export function isClientSortKey(key: string): key is ClientSortKey {
  return isCountSortKeyGeneric(key, CLIENT_SORT_KEYS);
}

/**
 * カウント項目でイベントをソート
 */
export function sortEventsByCount(
  events: EventWithCounts[],
  sortKey: CountSortKey,
  sortAsc: boolean
): EventWithCounts[] {
  return sortByCountField(events, sortKey, sortAsc);
}

/**
 * クライアント側でイベントをソート（イベントタイプマスタから取得するフィールド用）
 */
export function sortEventsByClient(
  events: EventWithCounts[],
  sortKey: ClientSortKey,
  sortAsc: boolean
): EventWithCounts[] {
  return [...events].sort((a, b) => {
    let aValue: string | number | null = null;
    let bValue: string | number | null = null;

    if (sortKey === "target_graduation_year") {
      aValue = a.target_graduation_year ?? null;
      bValue = b.target_graduation_year ?? null;
    } else if (sortKey === "area") {
      aValue = a.area ?? null;
      bValue = b.area ?? null;
    } else if (sortKey === "event_name") {
      aValue = a.event_name ?? null;
      bValue = b.event_name ?? null;
    }

    // null値の処理
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return sortAsc ? 1 : -1;
    if (bValue === null) return sortAsc ? -1 : 1;

    // 数値の場合は数値として比較
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortAsc ? aValue - bValue : bValue - aValue;
    }

    // 文字列の場合は文字列として比較
    const aStr = String(aValue);
    const bStr = String(bValue);
    return sortAsc
      ? aStr.localeCompare(bStr, "ja")
      : bStr.localeCompare(aStr, "ja");
  });
}

