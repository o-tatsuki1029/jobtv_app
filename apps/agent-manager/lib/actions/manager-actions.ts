"use server";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@jobtv-app/shared/types";

export type ManagerData = Tables<"profiles">;

/**
 * 管理者一覧を取得
 */
export async function getManagers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .in("role", ["admin", "RA", "CA", "MRK"])
    .order("full_name")
    .order("email");

  if (error) {
    console.error("Get managers error:", error);
    return { data: null, error: error.message };
  }

  return { data: (data as ManagerData[]) || [], error: null };
}

/**
 * 管理者を更新
 */
export async function updateManager(
  id: string,
  data: { full_name?: string | null; role?: string },
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name || null,
      role: data.role,
    })
    .eq("id", id);

  if (error) {
    console.error("Update manager error:", error);
    return { data: null, error: error.message };
  }

  return { data: { id }, error: null };
}
