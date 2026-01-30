import { getCandidateInfo } from "@/utils/api/routes/candidate-info";
import {
  unauthorizedResponse,
  notFoundResponse,
  errorResponse,
  successResponse,
} from "@/utils/api/response";

export async function GET() {
  try {
    const result = await getCandidateInfo();
    return successResponse(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "";
    if (errorMessage === "ログインしていません") {
      return unauthorizedResponse(errorMessage);
    }
    if (errorMessage.includes("取得に失敗")) {
      return notFoundResponse(errorMessage);
    }
    return errorResponse("学生情報の取得に失敗しました", 500);
  }
}

