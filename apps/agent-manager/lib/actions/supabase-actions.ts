"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * テーブルからデータを取得
 */
export async function queryTable<T>(
  table: string,
  options: {
    select?: string;
    eq?: { column: string; value: unknown }[];
    order?: { column: string; ascending?: boolean };
    limit?: number;
  } = {}
) {
  const supabase = await createClient();

  let query = supabase.from(table).select(options.select || "*");

  if (options.eq) {
    options.eq.forEach(({ column, value }) => {
      query = query.eq(column, value);
    });
  }

  if (options.order) {
    query = query.order(options.order.column, {
      ascending: options.order.ascending ?? true,
    });
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Query error:", error);
    return { data: null, error: error.message };
  }

  return { data: data as T[], error: null };
}

/**
 * レコードを挿入
 */
export async function insertRecord<T>(
  table: string,
  values: Partial<T>,
  revalidatePaths?: string[]
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .insert(values)
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error);
    return { data: null, error: error.message };
  }

  // パスの再検証
  if (revalidatePaths) {
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return { data: data as T, error: null };
}

/**
 * レコードを更新
 */
export async function updateRecord<T>(
  table: string,
  id: string,
  values: Partial<T>,
  revalidatePaths?: string[]
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return { data: null, error: error.message };
  }

  // パスの再検証
  if (revalidatePaths) {
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return { data: data as T, error: null };
}

/**
 * レコードを削除
 */
export async function deleteRecord(
  table: string,
  id: string,
  revalidatePaths?: string[]
) {
  const supabase = await createClient();

  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return { error: error.message };
  }

  // パスの再検証
  if (revalidatePaths) {
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return { error: null };
}

/**
 * 単一レコードを取得
 */
export async function getRecordById<T>(table: string, id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Get record error:", error);
    return { data: null, error: error.message };
  }

  return { data: data as T, error: null };
}
