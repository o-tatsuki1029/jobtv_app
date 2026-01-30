"use server";

// Re-export shared Supabase CRUD actions
import {
  supabaseSelect as baseSupabaseSelect,
  supabaseInsert as baseSupabaseInsert,
  supabaseUpdate as baseSupabaseUpdate,
  supabaseDelete as baseSupabaseDelete,
  supabaseGetById as baseSupabaseGetById,
} from "@jobtv-app/shared/actions";

// Re-export types explicitly
export type { SupabaseResult, QueryOptions } from "@jobtv-app/shared/actions";

// Re-export shared actions
export const supabaseSelect = baseSupabaseSelect;
export const supabaseInsert = baseSupabaseInsert;
export const supabaseUpdate = baseSupabaseUpdate;
export const supabaseDelete = baseSupabaseDelete;
export const supabaseGetById = baseSupabaseGetById;
