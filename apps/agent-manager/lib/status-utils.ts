/**
 * ステータス表示用ユーティリティ関数
 */

/**
 * 応募ステータスのラベルを取得
 */
export function getApplicationStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    applied: "応募済み",
    document_screening: "書類選考",
    first_interview: "一次面接",
    second_interview: "二次面接",
    final_interview: "最終面接",
    offer: "内定",
    rejected: "不採用",
    withdrawn: "辞退",
  };
  return statusMap[status] || status;
}

/**
 * 応募ステータスのバッジバリアントを取得
 */
export function getApplicationStatusBadgeVariant(
  status: string
): "default" | "secondary" | "outline" {
  switch (status) {
    case "offer":
      return "default";
    case "rejected":
    case "withdrawn":
      return "secondary";
    default:
      return "outline";
  }
}

/**
 * 求人ステータスのラベルを取得
 */
export function getJobStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    draft: "下書き",
    active: "公開中",
    closed: "募集終了",
  };
  return statusMap[status] || status;
}
