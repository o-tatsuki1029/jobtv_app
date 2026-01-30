import { Suspense } from "react";
import { ApplicationsListContent } from "@/components/applications-list-content";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">応募管理</h1>
        <p className="text-muted-foreground">応募情報の確認・ステータス管理</p>
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
        <ApplicationsListContent />
      </Suspense>
    </div>
  );
}
