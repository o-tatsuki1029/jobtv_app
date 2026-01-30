/**
 * ステータス表示用ユーティリティ関数
 */

import {
  APPLICATION_STATUS_LABELS,
  JOB_STATUS_LABELS,
  STATUS_BADGE_VARIANTS,
  type BadgeVariant,
} from "@/constants/status";

/**
 * 応募ステータスのラベルを取得
 */
export function getApplicationStatusLabel(status: string): string {
  return APPLICATION_STATUS_LABELS[status] || status;
}

/**
 * 応募ステータスのバッジバリアントを取得
 */
export function getApplicationStatusBadgeVariant(status: string): BadgeVariant {
  return STATUS_BADGE_VARIANTS[status] || "outline";
}

/**
 * 求人ステータスのラベルを取得
 */
export function getJobStatusLabel(status: string): string {
  return JOB_STATUS_LABELS[status] || status;
}
