import { getCSRFTokenForAPI } from "@/utils/api/routes/csrf-token";
import { successResponse } from "@/utils/api/response";

/**
 * CSRFトークンを取得するAPIエンドポイント
 * クライアント側でこのエンドポイントを呼び出してトークンを取得し、
 * 以降のPOST/PUT/DELETEリクエストのヘッダーに含める
 */
export async function GET() {
  try {
    const result = await getCSRFTokenForAPI();
    return successResponse(result);
  } catch (error) {
    return successResponse({ csrfToken: null });
  }
}

