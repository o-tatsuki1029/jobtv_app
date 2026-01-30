"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getRedirectPathByRole } from "@/utils/auth/index";
import { translateAuthError } from "@/utils/auth/errors";

/**
 * ログアウト処理
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // 学生ログイン用のクッキーも削除
  const cookieStore = await cookies();
  cookieStore.delete("candidate_id");
  cookieStore.delete("candidate_event_id");

  redirect("/login");
}

/**
 * ログイン処理
 */
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください" };
  }

  const supabase = await createClient();

  const { data, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return { error: translateAuthError(signInError) };
  }

  if (!data.user) {
    return { error: "ログインに失敗しました" };
  }

  const { data: userProfile, error: userProfileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (userProfileError) {
    if (userProfileError.code === "PGRST116") {
      return {
        error: "ユーザーロールが設定されていません。管理者に連絡してください。",
      };
    }
    return {
      error: "ユーザー情報の取得に失敗しました。管理者に連絡してください。",
    };
  }

  const role = userProfile?.role;
  if (!role) {
    return {
      error: "ユーザーロールが設定されていません。管理者に連絡してください。",
    };
  }

  const targetPath = redirectTo || getRedirectPathByRole(role as any);

  // サーバーアクション内でのリダイレクト
  redirect(targetPath);
}

/**
 * パスワードリセットメール送信
 */
export async function resetPasswordAction(formData: FormData) {
  const email = formData.get("email") as string;
  const origin = formData.get("origin") as string;

  if (!email) {
    return { error: "メールアドレスを入力してください" };
  }

  const supabase = await createClient();

  const { error: resetError } = await supabase.auth.resetPasswordForEmail(
    email,
    {
      redirectTo: `${origin}/login/update-password`,
    },
  );

  if (resetError) {
    return {
      error:
        resetError.message || "パスワードリセットメールの送信に失敗しました",
    };
  }

  return {
    message:
      "パスワードリセット用のメールを送信しました。メール内のリンクからパスワードを再設定してください。",
  };
}
