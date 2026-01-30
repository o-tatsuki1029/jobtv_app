import { CompaniesList } from "@/components/companies-list";
import { getCompanies, type CompanyData } from "@/lib/actions/company-actions";

type Company = CompanyData & { id: string; name: string };

export async function CompaniesListContent() {
  // Server Actions経由でデータを取得
  const { data: companies, error } = await getCompanies();

  if (error) {
    console.error("Error fetching companies:", error);
    return (
      <div className="text-center py-8">
        <p className="text-sm text-destructive">
          エラーが発生しました: {error}
        </p>
      </div>
    );
  }

  // idとnameが存在するものをフィルター
  const validCompanies = (companies || []).filter(
    (c): c is Company => !!c.id && !!c.name
  );

  return <CompaniesList companies={validCompanies} />;
}
