/**
 * 求職者情報の表示用ユーティリティ関数
 */

import type { Tables } from "@/types";

type CandidateBase = Pick<
  Tables<"candidates">,
  "last_name" | "first_name" | "last_name_kana" | "first_name_kana"
>;

/**
 * 求職者の表示名を取得
 * last_name と first_name があればそれらを結合して返す
 */
export function getCandidateDisplayName(
  candidate:
    | CandidateBase
    | null
    | undefined
    | Partial<CandidateBase>
    | { first_name?: string | null; last_name?: string | null },
): string {
  if (!candidate) {
    return "不明";
  }

  // last_name と first_name の両方がある場合は結合
  if (candidate.last_name && candidate.first_name) {
    return `${candidate.last_name} ${candidate.first_name}`;
  }

  // 片方だけある場合
  if (candidate.last_name) {
    return candidate.last_name;
  }
  if (candidate.first_name) {
    return candidate.first_name;
  }

  // どちらもない場合は不明
  return "不明";
}

/**
 * 求職者のカナ名を取得
 * last_name_kana と first_name_kana を結合して返す
 */
export function getCandidateDisplayKana(
  candidate: CandidateBase | null | undefined | Partial<CandidateBase>,
): string {
  if (!candidate) {
    return "";
  }

  const parts: string[] = [];

  if (candidate.last_name_kana) {
    parts.push(candidate.last_name_kana);
  }

  if (candidate.first_name_kana) {
    parts.push(candidate.first_name_kana);
  }

  return parts.length > 0 ? parts.join(" ") : "";
}
