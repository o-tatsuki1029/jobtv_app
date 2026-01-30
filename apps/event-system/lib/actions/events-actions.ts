"use server";

import { supabaseInsert, supabaseUpdate, supabaseSelect, supabaseDelete, SupabaseResult } from "./supabase-actions";
import { Database } from "@jobtv-app/shared/types";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];
type EventUpdate = Database["public"]["Tables"]["events"]["Update"];

/** 新規イベント作成 */
export async function createEvent(values: Partial<EventInsert>): Promise<SupabaseResult<EventRow>> {
  return supabaseInsert("events", values);
}

/** イベント更新 */
export async function updateEvent(id: string, values: Partial<EventUpdate>): Promise<SupabaseResult<EventRow>> {
  return supabaseUpdate("events", values, { id });
}

/** イベント取得 */
export async function getEvents(match?: Partial<EventRow>): Promise<SupabaseResult<EventRow[]>> {
  return supabaseSelect("events", match);
}

/** イベント削除 */
export async function deleteEvent(id: string): Promise<SupabaseResult<EventRow>> {
  return supabaseDelete("events", { id });
}

