import { Suspense } from "react";
import { JobsListContent } from "@/components/jobs-list-content";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">求人管理</h1>
        <p className="text-muted-foreground">求人情報の登録・編集・管理</p>
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
        <JobsListContent />
      </Suspense>
    </div>
  );
}
