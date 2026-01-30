/**
 * ステータス関連の定数
 */

/**
 * 応募ステータスのラベルマップ
 */
export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  applied: "応募済み",
  document_screening: "書類選考",
  first_interview: "一次面接",
  second_interview: "二次面接",
  final_interview: "最終面接",
  offer: "内定",
  rejected: "不採用",
  withdrawn: "辞退",
};

/**
 * 求人ステータスのラベルマップ
 */
export const JOB_STATUS_LABELS: Record<string, string> = {
  draft: "下書き",
  active: "公開中",
  closed: "募集終了",
};

/**
 * 応募ステータスのバッジバリアント
 */
export type BadgeVariant = "default" | "secondary" | "outline";

/**
 * ステータスごとのバッジバリアントマップ
 */
export const STATUS_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  offer: "default",
  rejected: "secondary",
  withdrawn: "secondary",
};

