import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type UseDataFetchOptions<T> = {
  table: string;
  select?: string;
  transform?: (data: unknown[]) => T[];
  onError?: (error: Error) => void;
};

/**
 * データフェッチの共通ロジックを提供するカスタムフック
 */
export function useDataFetch<T = unknown>(options: UseDataFetchOptions<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryBuilder?: (query: any) => any
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        let query = supabase.from(options.table).select(options.select || "*");

        if (queryBuilder) {
          query = queryBuilder(query);
        }

        const { data: fetchedData, error: fetchError } = await query;

        if (fetchError) {
          const errorMessage =
            fetchError && typeof fetchError === "object" && "message" in fetchError
              ? String((fetchError as { message: string }).message)
              : "データの取得に失敗しました";
          throw new Error(errorMessage);
        }

        const transformedData = options.transform
          ? options.transform(fetchedData || [])
          : (fetchedData || []) as T[];

        setData(transformedData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "データの取得に失敗しました";
        setError(errorMessage);
        if (options.onError && err instanceof Error) {
          options.onError(err);
        }
        console.error("データ取得エラー:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return {
    data,
    isLoading,
    error,
    fetchData,
    setData,
    setError,
  };
}

