import { NextRequest } from "next/server";
import { saveCandidateRating } from "@/utils/api/routes/candidate-ratings";
import {
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
  successResponse,
} from "@/utils/api/response";
import { checkRateLimit } from "@/utils/validation/rate-limit";
import { verifyCSRFToken } from "@/utils/security/csrf";

export async function POST(request: NextRequest) {
  try {
    // CSRFトークンの検証（GETリクエスト以外）
    const isValidCSRF = await verifyCSRFToken(request.headers);
    if (!isValidCSRF) {
      return errorResponse("CSRFトークンの検証に失敗しました", 403);
    }
    
    // レート制限チェック（IPアドレスベース）
    const ipAddress = request.headers.get("x-forwarded-for") || 
                      request.headers.get("x-real-ip") || 
                      "unknown";
    const rateLimitKey = `ratings:${ipAddress}`;
    
    if (!checkRateLimit(rateLimitKey, 20, 60000)) { // 1分間に20回まで
      return errorResponse("リクエストが多すぎます。しばらく待ってから再度お試しください。", 429);
    }
    
    const { companyId, eventId, rating, comment, candidateId } = await request.json();

    const result = await saveCandidateRating(
      companyId,
      eventId,
      rating,
      comment,
      candidateId // 管理者が代理で評価する場合に使用
    );
    return successResponse(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "";
    if (errorMessage === "ログインしていません") {
      return unauthorizedResponse(errorMessage);
    }
    if (
      errorMessage.includes("必須項目") ||
      errorMessage.includes("60字以内")
    ) {
      return validationErrorResponse(errorMessage);
    }
    return errorResponse("評価の保存に失敗しました", 500);
  }
}

