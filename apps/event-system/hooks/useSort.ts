import { useState, useCallback } from "react";

type UseSortProps<T> = {
  initialKey: T;
  initialAsc?: boolean;
};

/**
 * ソートを管理するカスタムフック
 */
export function useSort<T extends string>({
  initialKey,
  initialAsc = true,
}: UseSortProps<T>) {
  const [sortKey, setSortKey] = useState<T>(initialKey);
  const [sortAsc, setSortAsc] = useState(initialAsc);

  const handleSort = useCallback(
    (key: T) => {
      if (key === sortKey) {
        setSortAsc((prev) => !prev);
      } else {
        setSortKey(key);
        setSortAsc(true);
      }
    },
    [sortKey]
  );

  return {
    sortKey,
    sortAsc,
    setSortKey,
    setSortAsc,
    handleSort,
  };
}


