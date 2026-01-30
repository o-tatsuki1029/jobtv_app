import { Company } from "@/types/company.types";
import { sortByCountField, isCountSortKey as isCountSortKeyGeneric } from "@/utils/sort/index";

export type CompanyWithRecruiterCount = Company & {
  recruiter_count: number;
};

// カウント項目のキー
const COUNT_SORT_KEYS = [
  "recruiter_count",
] as const;

export type CountSortKey = typeof COUNT_SORT_KEYS[number];

/**
 * ソートキーがカウント項目かどうかを判定
 */
export function isCountSortKey(key: string): key is CountSortKey {
  return isCountSortKeyGeneric(key, COUNT_SORT_KEYS);
}

/**
 * カウント項目で企業をソート
 */
export function sortCompaniesByCount(
  companies: CompanyWithRecruiterCount[],
  sortKey: CountSortKey,
  sortAsc: boolean
): CompanyWithRecruiterCount[] {
  return sortByCountField(companies, sortKey, sortAsc);
}

