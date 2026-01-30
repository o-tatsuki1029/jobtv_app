import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PaginationInfo, User } from "@jobtv-app/shared/types";

type SortInfo<T> = {
  sortKey: keyof T;
  sortAsc: boolean;
};

type UseUsersParams = {
  keyword: string;
  pagination: PaginationInfo & {
    setTotalCount: (count: number) => void;
  };
  sort: SortInfo<User>;
};

type UseUsersReturn = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  setError: (error: string | null) => void;
};

/**
 * ユーザー一覧管理のカスタムフック
 */
export function useUsers({
  keyword,
  pagination,
  sort,
}: UseUsersParams): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const from = pagination.page * pagination.pageSize;
      const to = from + pagination.pageSize - 1;

      let query = supabase.from("profiles").select("*", { count: "exact" });

      // キーワード検索（メールアドレス）
      if (keyword) {
        query = query.ilike("email", `%${keyword}%`);
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
        setError("ユーザーの取得に失敗しました。もう一度お試しください。");
        setUsers([]);
        pagination.setTotalCount(0);
        return;
      }

      setUsers(data || []);
      pagination.setTotalCount(count || 0);
    } catch (err) {
      console.error("予期しないエラー:", err);
      setError("予期しないエラーが発生しました。");
      setUsers([]);
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
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    setError,
  };
}

