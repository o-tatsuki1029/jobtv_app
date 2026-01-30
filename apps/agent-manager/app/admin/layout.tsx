import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCog,
  Briefcase,
  FileText,
} from "lucide-react";
import { AdminHeaderContent } from "@/components/admin-layout-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
    { href: "/admin/companies", label: "企業管理", icon: Building2 },
    { href: "/admin/candidates", label: "求職者管理", icon: Users },
    { href: "/admin/jobs", label: "求人管理", icon: Briefcase },
    { href: "/admin/applications", label: "応募管理", icon: FileText },
    { href: "/admin/managers", label: "管理者管理", icon: UserCog },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ヘッダー */}
      <header className="border-b border-border bg-background">
        <AdminHeaderContent />
      </header>

      <div className="flex flex-1">
        {/* サイドバー */}
        <aside className="w-64 border-r border-border bg-muted/40">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
