import { createClient } from "@/lib/supabase/client";
import type { Company } from "@/types/company.types";
import type { CompanyWithRecruiterCount } from "@/utils/sort/company";
import type { EventCompany } from "@/utils/events/company";

/**
 * 企業IDの配列から担当者数を集計
 */
export async function getRecruiterCounts(
  companyIds: string[]
): Promise<Record<string, number>> {
  if (companyIds.length === 0) {
    return {};
  }

  const supabase = createClient();
  const { data: recruiters, error } = await supabase
    .from("profiles")
    .select("company_id")
    .in("company_id", companyIds);

  if (error || !recruiters) {
    console.error("担当者数取得エラー:", error);
    return {};
  }

  // 企業IDごとに担当者数を集計
  return recruiters.reduce((acc, recruiter) => {
    acc[recruiter.company_id] = (acc[recruiter.company_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * 企業データに担当者数を追加
 */
export function addRecruiterCounts(
  companies: Company[],
  recruiterCounts: Record<string, number>
): CompanyWithRecruiterCount[] {
  return companies.map((company) => ({
    ...company,
    recruiter_count: recruiterCounts[company.id] || 0,
  }));
}

/**
 * 企業をキーワードでフィルタリング
 */
export function filterCompanies(
  companies: Company[],
  keyword: string
): Company[] {
  if (!keyword.trim()) {
    return companies;
  }

  const lowerKeyword = keyword.toLowerCase();
  return companies.filter((company) =>
    company.name.toLowerCase().includes(lowerKeyword)
  );
}

/**
 * 未登録の企業を取得
 */
export function getUnregisteredCompanies(
  allCompanies: Company[],
  eventCompanies: EventCompany[]
): Company[] {
  const registeredCompanyIds = new Set(
    eventCompanies.map((ec) => ec.company_id)
  );
  return allCompanies.filter(
    (company) => !registeredCompanyIds.has(company.id)
  );
}
