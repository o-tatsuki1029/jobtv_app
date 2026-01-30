/**
 * 入力値のサニタイゼーション（XSS対策）
 */

/**
 * HTMLタグをエスケープ
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 文字列をサニタイズ（HTMLタグを削除、特殊文字をエスケープ）
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return "";
  
  // HTMLタグを削除
  const withoutTags = input.replace(/<[^>]*>/g, "");
  
  // 特殊文字をエスケープ
  return escapeHtml(withoutTags).trim();
}

/**
 * 数値の範囲チェックとサニタイズ
 */
export function sanitizeNumber(
  value: unknown,
  min?: number,
  max?: number
): number | null {
  if (value === null || value === undefined) return null;
  
  const num = typeof value === "number" ? value : Number(value);
  
  if (isNaN(num)) return null;
  
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  
  return num;
}

/**
 * UUID形式の検証
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * 文字列の長さ制限
 */
export function truncateString(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength);
}

