// ✅ 汎用的な Supabase CRUD ユーティリティ
"use server";

import { createClient } from "@/lib/supabase/server";
import { Database, Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

// --------------------------------------------
// 共通の返却型
// data に型付けされた結果、error にエラー内容を格納
// --------------------------------------------
export type SupabaseResult<T> = {
  data: T | null;
  error: unknown;
};

// --------------------------------------------
// 共通クエリラッパー
// createClient によるクライアント生成をラップし
// エラー処理を一元化
// --------------------------------------------
async function supabaseQuery<T>(
  fn: (client: Awaited<ReturnType<typeof createClient>>) => Promise<SupabaseResult<T>>
): Promise<SupabaseResult<T>> {
  try {
    const client = await createClient();
    return await fn(client);
  } catch (error) {
    return { data: null, error };
  }
}

// --------------------------------------------
// INSERT
// - table: テーブル名
// - values: Insert 型に基づくデータ
// insert → select → single() で挿入行を返す
// --------------------------------------------
export async function supabaseInsert<TableName extends keyof Database["public"]["Tables"]>(
  table: TableName,
  values: Partial<TablesInsert<TableName>>
): Promise<SupabaseResult<Tables<TableName>>> {
  return supabaseQuery(async (client) => {
    const { data, error } = await client.from(table).insert(values).select().single();
    return { data, error };
  });
}

// --------------------------------------------
// SELECT
// - match: WHERE 条件（任意）
// - 全件 or 条件一致を返却
// --------------------------------------------
export async function supabaseSelect<TableName extends keyof Database["public"]["Tables"]>(
  table: TableName,
  match?: Partial<Tables<TableName>>
): Promise<SupabaseResult<Tables<TableName>[]>> {
  return supabaseQuery(async (client) => {
    let query = client.from(table).select("*");
    if (match) query = query.match(match);
    const { data, error } = await query;
    return { data, error };
  });
}

// --------------------------------------------
// UPDATE
// - values: 更新する値
// - match: 更新条件
// update → select → single() で更新後の 1 行を返す
// --------------------------------------------
export async function supabaseUpdate<TableName extends keyof Database["public"]["Tables"]>(
  table: TableName,
  values: Partial<TablesUpdate<TableName>>,
  match: Partial<Tables<TableName>>
): Promise<SupabaseResult<Tables<TableName>>> {
  return supabaseQuery(async (client) => {
    const { data, error } = await client.from(table).update(values).match(match).select().single();
    return { data, error };
  });
}

// --------------------------------------------
// DELETE
// - match: 削除対象
// delete → select → single() で削除された行を返す
// --------------------------------------------
export async function supabaseDelete<TableName extends keyof Database["public"]["Tables"]>(
  table: TableName,
  match: Partial<Tables<TableName>>
): Promise<SupabaseResult<Tables<TableName>>> {
  return supabaseQuery(async (client) => {
    const { data, error } = await client.from(table).delete().match(match).select().single();
    return { data, error };
  });
}

