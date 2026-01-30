/**
 * CSRFトークンを取得するAPIルート用ユーティリティ
 */
import { setCSRFToken } from "@/utils/security/csrf";

export async function getCSRFTokenForAPI() {
  const token = await setCSRFToken();
  return { csrfToken: token };
}

