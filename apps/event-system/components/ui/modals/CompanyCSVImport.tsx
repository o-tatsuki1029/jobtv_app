"use client";

import CSVImport from "@/components/ui/csv/CSVImport";
import { CompanyFormData } from "@/types/company.types";

export default function CompanyCSVImport() {
  return (
    <CSVImport<CompanyFormData>
      tableName="companies"
      inputId="company-csv-input"
      transformRow={(row: string[]) => ({
        name: row[0]?.trim() || "",
      })}
      validateData={(data: CompanyFormData) => !!data.name}
      formatHeaders={["企業名"]}
      formatRows={[["株式会社サンプル"]]}
      formatFilename="companies_format.csv"
    />
  );
}
