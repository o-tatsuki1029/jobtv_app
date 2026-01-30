/**
 * CSRF対策ユーティリティ
 */

import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const CSRF_TOKEN_COOKIE_NAME = "csrf_token";
const CSRF_TOKEN_HEADER_NAME = "x-csrf-token";
const CSRF_TOKEN_MAX_AGE = 60 * 60 * 24; // 24時間

/**
 * CSRFトークンを生成
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * CSRFトークンをクッキーに設定
 */
export async function setCSRFToken(): Promise<string> {
  const token = generateCSRFToken();
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  
  cookieStore.set(CSRF_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: CSRF_TOKEN_MAX_AGE,
    path: "/",
  });
  
  return token;
}

/**
 * CSRFトークンを取得（クッキーから）
 */
export async function getCSRFToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_COOKIE_NAME)?.value || null;
}

/**
 * CSRFトークンを検証
 * @param requestHeaders リクエストヘッダー
 * @returns 検証成功時はtrue、失敗時はfalse
 */
export async function verifyCSRFToken(
  requestHeaders: Headers
): Promise<boolean> {
  const tokenFromHeader = requestHeaders.get(CSRF_TOKEN_HEADER_NAME);
  const tokenFromCookie = await getCSRFToken();
  
  if (!tokenFromHeader || !tokenFromCookie) {
    return false;
  }
  
  // タイミング攻撃を防ぐため、定数時間比較を使用
  return constantTimeCompare(tokenFromHeader, tokenFromCookie);
}

/**
 * 定数時間での文字列比較（タイミング攻撃対策）
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

