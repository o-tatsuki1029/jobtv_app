import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Candidate } from "@/types/candidate.types";
import type { PaginationInfo } from "@jobtv-app/shared/types";

type SortInfo<T> = {
  sortKey: keyof T;
  sortAsc: boolean;
};

type UseCandidatesParams = {
  keyword: string;
  pagination: PaginationInfo & {
    setTotalCount: (count: number) => void;
  };
  sort: SortInfo<Candidate>;
};

type UseCandidatesReturn = {
  candidates: Candidate[];
  isLoading: boolean;
  error: string | null;
  fetchCandidates: () => Promise<void>;
  setError: (error: string | null) => void;
};

/**
 * 学生一覧管理のカスタムフック
 */
export function useCandidates({
  keyword,
  pagination,
  sort,
}: UseCandidatesParams): UseCandidatesReturn {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const from = pagination.page * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      // 必要なカラムのみを取得（パフォーマンス最適化）
      let query = supabase.from("candidates").select(
        "id, last_name, first_name, last_name_kana, first_name_kana, email, phone, graduation_year, school_name, gender, major_field, school_type, entry_channel, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, created_at, updated_at",
        { count: "exact" }
      );

      // キーワード検索（メールアドレス、電話番号、フルネーム）
      if (keyword) {
        // フルネーム検索用に姓と名を結合した検索も追加
        query = query.or(
          `email.ilike.%${keyword}%,phone.ilike.%${keyword}%,last_name.ilike.%${keyword}%,first_name.ilike.%${keyword}%,last_name_kana.ilike.%${keyword}%,first_name_kana.ilike.%${keyword}%`
        );
      }

      const {
        data,
        error: queryError,
        count,
      } = await query
        .order(String(sort.sortKey), { ascending: sort.sortAsc })
        .range(from, to);

      if (queryError) {
        console.error("取得エラー:", queryError);
        setError("学生の取得に失敗しました。もう一度お試しください。");
        setCandidates([]);
        pagination.setTotalCount(0);
        return;
      }

      // データをCandidate型に変換
      const candidates = (data || []) as Candidate[];
      setCandidates(candidates);
      pagination.setTotalCount(count || 0);
    } catch (err) {
      console.error("予期しないエラー:", err);
      setError("予期しないエラーが発生しました。");
      setCandidates([]);
      pagination.setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    keyword,
    pagination.page,
    pagination.pageSize,
    pagination.setTotalCount,
    sort.sortKey,
    sort.sortAsc,
  ]);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  return {
    candidates,
    isLoading,
    error,
    fetchCandidates,
    setError,
  };
}

// 後方互換性のため、useJobSeekersもエクスポート（非推奨）
/** @deprecated Use useCandidates instead */
export const useJobSeekers = useCandidates;

