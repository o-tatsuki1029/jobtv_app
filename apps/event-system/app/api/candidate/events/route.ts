import { NextRequest } from "next/server";
import { getCandidateEvents } from "@/utils/api/routes/candidate-events";
import { errorResponse, successResponse } from "@/utils/api/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId");

    const result = await getCandidateEvents(candidateId);
    return successResponse(result);
  } catch (error: unknown) {
    console.error("Error fetching candidate events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "イベントの取得に失敗しました";
    return errorResponse(errorMessage, 500);
  }
}

