import Link from "next/link";
import { Suspense } from "react";
import Button from "@/components/ui/Button";
import { getUserInfo } from "@/utils/auth/get-user-info";
import { logoutAction } from "@/lib/actions/auth-actions";

function AdminHeaderContent() {
  return (
    <Suspense
      fallback={
        <div className="flex h-16 items-center justify-between px-6 bg-gray-900 text-white">
          <div className="flex items-center gap-6">
            <Link
              href="/admin/event"
              className="flex items-center gap-2 font-semibold"
            >
              <span>イベント運営システム</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">読み込み中...</span>
          </div>
        </div>
      }
    >
      <AdminHeaderInner />
    </Suspense>
  );
}

async function AdminHeaderInner() {
  // 認証チェックはレイアウトで実施済み
  const userInfo = await getUserInfo();

  return (
    <div className="flex h-16 items-center justify-between px-6 bg-gray-900 text-white">
      <div className="flex items-center gap-6">
        <Link href="/admin/event" className="flex items-center gap-2 font-semibold">
          <span>イベント運営システム</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-300">{userInfo?.email || ""}</span>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            className="bg-gray-600 hover:bg-gray-500 text-white"
          >
            ログアウト
          </Button>
        </form>
      </div>
    </div>
  );
}

export { AdminHeaderContent };

