import { NextRequest } from "next/server";
import { getCandidateSeatNumbers } from "@/utils/api/routes/candidate-seat-numbers";
import {
  validationErrorResponse,
  errorResponse,
  successResponse,
} from "@/utils/api/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    const result = await getCandidateSeatNumbers(eventId!);
    return successResponse(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "";
    if (errorMessage.includes("が必要です")) {
      return validationErrorResponse(errorMessage);
    }
    return errorResponse("席番号の取得に失敗しました", 500);
  }
}

