/**
 * エラーオブジェクトからエラーメッセージを取得するユーティリティ関数
 * @param error - エラーオブジェクト（unknown型）
 * @returns エラーメッセージの文字列
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "エラーが発生しました";
}
