"use server";

import { revalidatePath } from "next/cache";
import {
  signInWithPassword as baseSignInWithPassword,
  signUp as baseSignUp,
  signOut as baseSignOut,
  resetPasswordForEmail as baseResetPasswordForEmail,
  updatePassword as baseUpdatePassword,
} from "@jobtv-app/shared/actions/auth";

/**
 * パスワードでサインイン
 */
export async function signInWithPassword(email: string, password: string) {
  const result = await baseSignInWithPassword(email, password);
  if (!result.error) {
    revalidatePath("/", "layout");
  }
  return result;
}

/**
 * サインアップ
 */
export async function signUp(
  email: string,
  password: string,
  redirectTo?: string,
) {
  return baseSignUp(email, password, redirectTo);
}

/**
 * サインアウト
 */
export async function signOut() {
  const result = await baseSignOut();
  if (!result.error) {
    revalidatePath("/", "layout");
  }
  return result;
}

/**
 * パスワードリセットメールを送信
 */
export async function resetPasswordForEmail(
  email: string,
  redirectTo?: string,
) {
  return baseResetPasswordForEmail(email, redirectTo);
}

/**
 * パスワードを更新
 */
export async function updatePassword(password: string) {
  const result = await baseUpdatePassword(password);
  if (!result.error) {
    revalidatePath("/", "layout");
  }
  return result;
}
