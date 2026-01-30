"use server";

import { revalidatePath } from "next/cache";
import {
  supabaseSelect as baseSupabaseSelect,
  supabaseInsert as baseSupabaseInsert,
  supabaseUpdate as baseSupabaseUpdate,
  supabaseDelete as baseSupabaseDelete,
  supabaseGetById as baseSupabaseGetById,
} from "@jobtv-app/shared/actions";

// Re-export types explicitly
export type { SupabaseResult, QueryOptions } from "@jobtv-app/shared/actions";

// Re-export shared actions with consistent naming
export const supabaseSelect = baseSupabaseSelect;
export const supabaseInsert = baseSupabaseInsert;
export const supabaseUpdate = baseSupabaseUpdate;
export const supabaseDelete = baseSupabaseDelete;
export const supabaseGetById = baseSupabaseGetById;

/**
 * Agent-manager固有のヘルパー関数
 * 共通のCRUD操作にrevalidatePathを追加
 */

// 後方互換性のためのエイリアス
export const queryTable = baseSupabaseSelect;
export const getRecordById = baseSupabaseGetById;

/**
 * レコードを挿入してパスを再検証
 */
export async function insertRecord<T>(
  table: string,
  values: Partial<T>,
  revalidatePaths?: string[]
) {
  const result = await baseSupabaseInsert(table as any, values);

  if (!result.error && revalidatePaths) {
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return result;
}

/**
 * レコードを更新してパスを再検証
 */
export async function updateRecord<T>(
  table: string,
  id: string,
  values: Partial<T>,
  revalidatePaths?: string[]
) {
  const result = await baseSupabaseUpdate(table as any, values, { id });

  if (!result.error && revalidatePaths) {
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return result;
}

/**
 * レコードを削除してパスを再検証
 */
export async function deleteRecord(
  table: string,
  id: string,
  revalidatePaths?: string[]
) {
  const result = await baseSupabaseDelete(table as any, { id });

  if (!result.error && revalidatePaths) {
    revalidatePaths.forEach((path) => revalidatePath(path));
  }

  return { error: result.error };
}
