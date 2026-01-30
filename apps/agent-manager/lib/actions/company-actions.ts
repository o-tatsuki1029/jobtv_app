"use server";

import { createClient } from "@/lib/supabase/server";
import { insertRecord, updateRecord, queryTable } from "./supabase-actions";
import type { TablesInsert } from "@/types";

export type CompanyData = Partial<TablesInsert<"companies">> & { id?: string };

/**
 * 企業一覧を取得
 */
export async function getCompanies() {
  return queryTable<CompanyData>("companies", {
    select: "*",
    order: { column: "created_at", ascending: false },
  });
}

/**
 * 単一の企業を取得
 */
export async function getCompany(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Get company error:", error);
    return { data: null, error: error.message };
  }

  return { data: data as CompanyData, error: null };
}

/**
 * 企業の求人一覧を取得
 */
export async function getCompanyJobs(companyId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get company jobs error:", error);
    return { data: null, error: error.message };
  }

  return { data: data || [], error: null };
}

/**
 * 企業を作成
 */
export async function createCompany(data: Omit<CompanyData, "id">) {
  return insertRecord<CompanyData>("companies", data, ["/admin/companies"]);
}

/**
 * 企業を更新
 */
export async function updateCompany(id: string, data: Partial<CompanyData>) {
  return updateRecord<CompanyData>("companies", id, data, ["/admin/companies"]);
}
