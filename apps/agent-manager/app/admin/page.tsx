import { Suspense } from "react";
import { AdminDashboardContent } from "@/components/admin-dashboard-content";
import { AdminMenuCards } from "@/components/admin-menu-cards";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ダッシュボード</h1>
        <p className="text-muted-foreground">システム全体の概要と統計情報</p>
      </div>

      {/* メニューカード */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">管理者メニュー</h2>
        <AdminMenuCards />
      </div>

      {/* 統計情報 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">統計情報</h2>
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">読み込み中...</p>
              </div>
            </div>
          }
        >
          <AdminDashboardContent />
        </Suspense>
      </div>
    </div>
  );
}
