"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * パスワードでサインイン
 */
export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { error: null };
}

/**
 * サインアップ
 */
export async function signUp(
  email: string,
  password: string,
  redirectTo?: string
) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * サインアウト
 */
export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { error: null };
}

/**
 * パスワードリセットメールを送信
 */
export async function resetPasswordForEmail(
  email: string,
  redirectTo?: string
) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}

/**
 * パスワードを更新
 */
export async function updatePassword(password: string) {
  const supabase = await createClient();

  // セッションを確認
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error:
        "セッションが見つかりません。パスワードリセットリンクから再度アクセスしてください。",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { error: null };
}
