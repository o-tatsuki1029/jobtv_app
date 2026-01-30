import { useState, useEffect, useCallback } from "react";
import { DEFAULT_PAGE_SIZE } from "@/constants/options";

type UsePaginationProps = {
  initialPageSize?: number;
};

/**
 * ページネーションを管理するカスタムフック
 */
export function usePagination(props?: UsePaginationProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(
    props?.initialPageSize || DEFAULT_PAGE_SIZE
  );
  const [totalCount, setTotalCount] = useState(0);

  // ページサイズ変更時は1ページ目へ
  useEffect(() => {
    setPage(0);
  }, [pageSize]);

  const goToNextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const goToPrevPage = useCallback(() => {
    setPage((p) => Math.max(0, p - 1));
  }, []);

  const resetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    page,
    pageSize,
    totalCount,
    setPage,
    setPageSize,
    setTotalCount,
    goToNextPage,
    goToPrevPage,
    resetPage,
  };
}


