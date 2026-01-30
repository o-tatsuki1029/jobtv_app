import { NextRequest } from "next/server";
import { getCandidateCompanies } from "@/utils/api/routes/candidate-companies";
import {
  validationErrorResponse,
  errorResponse,
  successResponse,
} from "@/utils/api/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const candidateId = searchParams.get("candidateId");

    const result = await getCandidateCompanies(eventId!, candidateId!);
    return successResponse(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "";
    if (errorMessage.includes("が必要です")) {
      return validationErrorResponse(errorMessage);
    }
    if (errorMessage.includes("出席登録されていません")) {
      return errorResponse(errorMessage, 403);
    }
    return errorResponse("企業の取得に失敗しました", 500);
  }
}

