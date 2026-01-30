/**
 * 共通型定義
 */

import { Database, TablesInsert, TablesUpdate } from "@/types/database.types";

/**
 * テーブル名の型
 */
export type TableName = keyof Database["public"]["Tables"];

/**
 * テーブルの行型を取得するヘルパー型
 */
export type TableRow<T extends TableName> = Database["public"]["Tables"][T]["Row"];

/**
 * テーブルの挿入型を取得するヘルパー型
 */
export type TableInsert<T extends TableName> = TablesInsert<T>;

/**
 * テーブルの更新型を取得するヘルパー型
 */
export type TableUpdate<T extends TableName> = TablesUpdate<T>;

/**
 * フォームデータ型（ID、タイムスタンプを除外）
 */
export type FormData<T extends TableName> = Omit<
  TableInsert<T>,
  "id" | "created_at" | "updated_at"
>;

/**
 * ページネーション情報
 */
export type PaginationInfo = {
  page: number;
  pageSize: number;
  totalCount: number;
};

/**
 * ソート情報
 */
export type SortInfo<T> = {
  sortKey: keyof T;
  sortAsc: boolean;
};

/**
 * APIレスポンス型
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

