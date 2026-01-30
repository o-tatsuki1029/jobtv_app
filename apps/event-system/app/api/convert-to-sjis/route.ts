import { NextRequest, NextResponse } from "next/server";
import { convertToShiftJIS } from "@/utils/api/routes/convert-to-sjis";
import {
  validationErrorResponse,
  errorResponse,
} from "@/utils/api/response";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return validationErrorResponse("Invalid request");
    }

    const shiftJISBuffer = convertToShiftJIS(text);

    return new NextResponse(shiftJISBuffer.buffer as BodyInit, {
      headers: {
        "Content-Type": "text/csv;charset=shift_jis",
      },
    });
  } catch (error) {
    return errorResponse("Conversion failed", 500);
  }
}
