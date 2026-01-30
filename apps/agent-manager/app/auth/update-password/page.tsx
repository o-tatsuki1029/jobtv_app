"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { UpdatePasswordForm } from "@/components/update-password-form";

function UpdatePasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const supabase = createClient();

      // クエリパラメータからトークンを取得
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      // フラグメントからトークンを取得（URLハッシュ）
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashToken = hashParams.get("access_token");

      if (token_hash && type) {
        // クエリパラメータでトークンが提供されている場合
        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: type as "recovery" | "signup" | "invite" | "magiclink" | "email",
          token_hash,
        });

        if (verifyError) {
          setError(verifyError.message);
          setIsVerifying(false);
          return;
        }
      } else if (hashToken) {
        // フラグメントでトークンが提供されている場合（Supabaseのデフォルト動作）
        // Supabaseクライアントが自動的にフラグメントからセッションを確立する
        // 少し待ってからセッションを確認
        await new Promise((resolve) => setTimeout(resolve, 500));

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError(
            "セッションが見つかりません。リンクが無効または期限切れです。"
          );
          setIsVerifying(false);
          return;
        }
      } else {
        // セッションを確認（既に認証済みの場合）
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setError(
            "セッションが見つかりません。パスワードリセットリンクから再度アクセスしてください。"
          );
          setIsVerifying(false);
          return;
        }
      }

      setIsVerifying(false);
    };

    verifyToken();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">認証中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="text-center py-8">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => router.push("/auth/forgot-password")}
              className="mt-4 text-sm text-primary underline"
            >
              パスワードリセットを再度試す
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        </div>
      }
    >
      <UpdatePasswordContent />
    </Suspense>
  );
}
