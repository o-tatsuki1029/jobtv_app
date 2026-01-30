import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UpdatePasswordForm } from "@/components/update-password-form";

export async function UpdatePasswordFormWrapper() {
  const supabase = await createClient();

  // セッションを確認
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // セッションがない場合はエラーページにリダイレクト
  if (!user) {
    redirect(
      "/auth/error?error=セッションが見つかりません。パスワードリセットリンクから再度アクセスしてください。"
    );
  }

  return <UpdatePasswordForm />;
}

