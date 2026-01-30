import { NextRequest } from "next/server";
import { parseCSV } from "@/utils/api/routes/parse-csv";
import {
  validationErrorResponse,
  errorResponse,
  successResponse,
} from "@/utils/api/response";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return validationErrorResponse("ファイルがありません");
    }

    const result = await parseCSV(file);
    return successResponse(result);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "";
    if (errorMessage === "CSVファイルが空です") {
      return validationErrorResponse(errorMessage);
    }
    return errorResponse("CSVパースに失敗しました", 500);
  }
}
