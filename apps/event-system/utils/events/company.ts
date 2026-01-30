
export type EventCompanyWithRelation = {
  id: string;
  company_id: string;
  event_id: string;
  companies: {
    name: string;
  } | null;
  created_at: string;
};

export type EventCompany = {
  id: string;
  company_id: string;
  event_id: string;
  name: string;
  created_at: string;
};

/**
 * イベント企業データを表示用にフォーマット
 */
export function formatEventCompanyData(
  data: EventCompanyWithRelation[]
): EventCompany[] {
  return data.map((item) => ({
    id: item.id,
    company_id: item.company_id,
    event_id: item.event_id,
    name: item.companies?.name || "不明",
    created_at: new Date(item.created_at).toLocaleDateString("ja-JP"),
  }));
}

