import { Suspense } from "react";
import { CompaniesListContent } from "@/components/companies-list-content";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">企業管理</h1>
        <p className="text-muted-foreground">登録されている企業の一覧と管理</p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        }
      >
        <CompaniesListContent />
      </Suspense>
    </div>
  );
}
