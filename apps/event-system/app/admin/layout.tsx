import { AdminHeaderContent } from "@/components/admin-layout-header";
import SidebarWrapper from "@/components/sidebar-wrapper";
import { requireAdmin } from "@jobtv-app/shared/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 管理者のみアクセス可能
  await requireAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-[60]">
        <AdminHeaderContent />
      </header>

      <div className="flex flex-1 pt-16">
        {/* サイドバー */}
        <aside className="hidden lg:block w-64 border-r border-gray-200 bg-gray-50 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <SidebarWrapper userRole="admin" isRoleLoading={false} />
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 lg:ml-64 p-4 md:p-10 bg-gray-50 overflow-x-auto overflow-y-auto">
          <div className="bg-white shadow-md rounded-lg min-h-full p-4 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

