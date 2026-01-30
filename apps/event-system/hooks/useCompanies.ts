import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getRecruiterCounts,
  addRecruiterCounts,
} from "@/utils/data/company";
import {
  isCountSortKey,
  sortCompaniesByCount,
  type CompanyWithRecruiterCount,
} from "@/utils/sort/company";
import type { PaginationInfo } from "@/types/common.types";

type SortInfo<T> = {
  sortKey: keyof T;
  sortAsc: boolean;
};

type UseCompaniesParams = {
  keyword: string;
  pagination: PaginationInfo & {
    setTotalCount: (count: number) => void;
  };
  sort: SortInfo<CompanyWithRecruiterCount>;
};

type UseCompaniesReturn = {
  companies: CompanyWithRecruiterCount[];
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  setError: (error: string | null) => void;
};

/**
 * 企業一覧管理のカスタムフック
 */
export function useCompanies({
  keyword,
  pagination,
  sort,
}: UseCompaniesParams): UseCompaniesReturn {
  const [companies, setCompanies] = useState<CompanyWithRecruiterCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const from = pagination.page * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      // ベースクエリ
      let query = supabase.from("companies").select("*", { count: "exact" });

      // キーワード検索
      if (keyword) {
        query = query.ilike("name", `%${keyword}%`);
      }

      const sortKey = sort.sortKey as string;
      const isCountSort = isCountSortKey(sortKey);

      // 総件数を取得
      let countQuery = supabase
        .from("companies")
        .select("*", { count: "exact", head: true });

      if (keyword) {
        countQuery = countQuery.ilike("name", `%${keyword}%`);
      }

      const { count } = await countQuery;

      // データ取得用のクエリ
      let queryForData = query;
      if (!isCountSort) {
        queryForData = queryForData.order(sortKey, {
          ascending: sort.sortAsc,
        });
      }

      // カウント項目でソートする場合は全件取得、そうでない場合はページング
      const { data: rawData, error: queryError } = isCountSort
        ? await queryForData
        : await queryForData.range(from, to);

      if (queryError) {
        console.error("取得エラー:", queryError);
        setError("企業の取得に失敗しました。もう一度お試しください。");
        setCompanies([]);
        pagination.setTotalCount(0);
        return;
      }

      if (!rawData || rawData.length === 0) {
        setCompanies([]);
        pagination.setTotalCount(count || 0);
        return;
      }

      // 担当者数を取得
      const companyIds = rawData.map((c) => c.id);
      const recruiterCounts = await getRecruiterCounts(companyIds);

      // 企業データに担当者数を追加
      let companiesWithCount = addRecruiterCounts(rawData, recruiterCounts);

      // カウント項目でソートする場合はクライアント側でソート
      if (isCountSort) {
        companiesWithCount = sortCompaniesByCount(
          companiesWithCount,
          sortKey as "recruiter_count",
          sort.sortAsc
        );
        // ページングを適用
        companiesWithCount = companiesWithCount.slice(from, to + 1);
      }

      setCompanies(companiesWithCount);
      pagination.setTotalCount(count || 0);
    } catch (err) {
      console.error("予期しないエラー:", err);
      setError("予期しないエラーが発生しました。");
      setCompanies([]);
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
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    isLoading,
    error,
    fetchCompanies,
    setError,
  };
}

