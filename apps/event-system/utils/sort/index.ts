/**
 * カウント項目でデータをソートする汎用関数
 * @template T - ソート対象のデータ型
 * @template K - カウント項目のキーの型（Tのキーで、数値型のもの）
 */
export function sortByCountField<T extends Record<string, unknown>, K extends keyof T>(
  data: T[],
  sortKey: K,
  sortAsc: boolean
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortAsc ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
}

/**
 * ソートキーがカウント項目（数値型）かどうかを判定
 * @template T - データ型
 * @template K - キーの型
 */
export function isCountField<T extends Record<string, unknown>, K extends keyof T>(
  data: T[],
  key: K
): boolean {
  if (data.length === 0) return false;
  const firstValue = data[0][key];
  return typeof firstValue === "number";
}

/**
 * カウント項目のキーリストから、指定されたキーが含まれているか判定
 * @template K - カウント項目のキーの型
 */
export function isCountSortKey<K extends string>(
  key: string,
  countKeys: readonly K[]
): key is K {
  return countKeys.includes(key as K);
}

