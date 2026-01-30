import { NextRequest } from "next/server";
import { verifyCandidate } from "@/utils/api/routes/candidate-verify";
import {
  validationErrorResponse,
  unauthorizedResponse,
  errorResponse,
  successResponse,
} from "@/utils/api/response";
import { verifyCSRFToken } from "@/utils/security/csrf";

export async function POST(request: NextRequest) {
  try {
    // CSRFトークンの検証（ログイン処理はCSRF攻撃の対象となるため）
    const isValidCSRF = await verifyCSRFToken(request.headers);
    if (!isValidCSRF) {
      return errorResponse("CSRFトークンの検証に失敗しました", 403);
    }
    
    const { eventId, seatNumber, phoneNumber } = await request.json();

    const result = await verifyCandidate(eventId, seatNumber, phoneNumber);
    return successResponse(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "";
    if (errorMessage === "すべての項目を入力してください") {
      return validationErrorResponse(errorMessage);
    }
    if (errorMessage.includes("一致しません")) {
      return unauthorizedResponse(errorMessage);
    }
    return errorResponse("認証に失敗しました", 500);
  }
}

