import { CandidateHeaderContent } from "@/components/candidate-layout-header";
import SidebarWrapper from "@/components/sidebar-wrapper";
import { getUserInfo } from "@/utils/auth/get-user-info";
import { cookies } from "next/headers";

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 管理者はアクセス可能、学生はcandidate_idクッキーが必要
  const userInfo = await getUserInfo();
  const isAdmin = userInfo?.role === "admin";
  
  if (!isAdmin) {
    const cookieStore = await cookies();
    const candidateId = cookieStore.get("candidate_id")?.value;
    if (!candidateId) {
      // 学生としてログインしていない場合はログインページにリダイレクト
      const { redirect } = await import("next/navigation");
      redirect("/candidate/login");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 z-[60]">
        <CandidateHeaderContent />
      </header>

      <div className="flex flex-1 pt-16">
        {/* サイドバー */}
        <aside className="hidden lg:block w-64 border-r border-gray-200 bg-gray-50 fixed left-0 top-16 bottom-0 overflow-y-auto">
          <SidebarWrapper userRole={isAdmin ? "admin" : "candidate"} isRoleLoading={false} />
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

