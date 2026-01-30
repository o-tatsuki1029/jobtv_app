import { RecruiterHeaderContent } from "@/components/recruiter-layout-header";
import SidebarWrapper from "@/components/sidebar-wrapper";
import { requireRecruiterOrAdmin } from "@jobtv-app/shared/auth";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 企業担当者または管理者のみアクセス可能
  const userInfo = await requireRecruiterOrAdmin();

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-[60]">
        <RecruiterHeaderContent />
      </header>

      <div className="flex flex-1 pt-16">
        {/* サイドバー */}
        <aside className="hidden lg:block w-64 border-r border-gray-200 bg-gray-50 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <SidebarWrapper userRole={userInfo.role} isRoleLoading={false} />
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 lg:ml-64 p-2 bg-gray-50 overflow-x-auto overflow-y-auto">
          <div className="bg-white shadow-md rounded-lg min-h-full p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

