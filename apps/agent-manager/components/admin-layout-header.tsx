import { AdminLayoutAuth } from "@/components/admin-layout-auth";
import { LogoutButton } from "@/components/logout-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Suspense } from "react";

function AdminHeaderContent() {
  return (
    <Suspense
      fallback={
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-semibold"
            >
              <Menu className="h-5 w-5" />
              <span>エージェントマネージャー</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">読み込み中...</span>
            <ThemeSwitcher />
            <LogoutButton />
          </div>
        </div>
      }
    >
      <AdminHeaderInner />
    </Suspense>
  );
}

async function AdminHeaderInner() {
  const user = await AdminLayoutAuth();

  return (
    <div className="flex h-16 items-center justify-between px-6">
      <div className="flex items-center gap-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Menu className="h-5 w-5" />
          <span>管理画面</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user.email}</span>
        <ThemeSwitcher />
        <LogoutButton />
      </div>
    </div>
  );
}

export { AdminHeaderContent };
