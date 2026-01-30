"use server";

import { supabaseSelect } from "./supabase-actions";
import { Database } from "@jobtv-app/shared/types";

type MasterArea = Database["public"]["Tables"]["master_areas"]["Row"];
type MasterGraduationYear = Database["public"]["Tables"]["master_graduation_years"]["Row"];
type MasterEventType = Database["public"]["Tables"]["master_event_types"]["Row"];

/**
 * エリアマスタを取得（すべて取得、is_activeに関係なく）
 */
export async function getMasterAreas(): Promise<MasterArea[]> {
  const { data, error } = await supabaseSelect<"master_areas">("master_areas");

  if (error || !data) {
    console.error("エリアマスタの取得に失敗しました:", error);
    return [];
  }

  // エリア名でソート
  return data.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 卒年度マスタを取得（すべて取得、is_activeに関係なく）
 */
export async function getMasterGraduationYears(): Promise<MasterGraduationYear[]> {
  const { data, error } = await supabaseSelect<"master_graduation_years">(
    "master_graduation_years"
  );

  if (error || !data) {
    console.error("卒年度マスタの取得に失敗しました:", error);
    return [];
  }

  // 卒年度でソート
  return data.sort((a, b) => a.year - b.year);
}

/**
 * イベントタイプマスタを取得（すべて取得、is_activeに関係なく）
 */
export async function getMasterEventTypes(): Promise<MasterEventType[]> {
  const { data, error } = await supabaseSelect<"master_event_types">(
    "master_event_types"
  );

  if (error || !data) {
    console.error("イベントタイプマスタの取得に失敗しました:", error);
    return [];
  }

  // イベント名でソート
  return data.sort((a, b) => a.name.localeCompare(b.name));
}

