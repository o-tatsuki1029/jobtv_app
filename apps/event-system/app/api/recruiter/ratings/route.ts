import { NextRequest } from "next/server";
import { saveRecruiterRating } from "@/utils/api/routes/recruiter-ratings";
import {
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
  successResponse,
} from "@/utils/api/response";

export async function POST(request: NextRequest) {
  try {
    const { companyId, eventId, candidateId, overallRating, comment, recruiterId } = await request.json();

    const result = await saveRecruiterRating(
      companyId,
      eventId,
      candidateId,
      overallRating,
      comment,
      recruiterId // 管理者が代理で評価する場合に使用
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

