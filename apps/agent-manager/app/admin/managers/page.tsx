import { Suspense } from "react";
import { ManagersPageContent } from "@/components/managers-page-content";

export default function ManagersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">管理者管理</h1>
        <p className="text-muted-foreground">
          管理者の氏名とロールを設定します
        </p>
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
        <ManagersPageContent />
      </Suspense>
    </div>
  );
}
