import { getCandidateSession } from "@/utils/api/routes/candidate-session";
import { errorResponse, successResponse } from "@/utils/api/response";

export async function GET() {
  try {
    const result = await getCandidateSession();
    return successResponse(result);
  } catch (error) {
    return errorResponse("セッション情報の取得に失敗しました", 500);
  }
}

