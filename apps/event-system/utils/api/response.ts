import { NextResponse } from "next/server";

/**
 * APIレスポンスの共通ユーティリティ
 */

export type ApiErrorResponse = {
  error: string;
  code?: string;
};

/**
 * 成功レスポンスを返す
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * エラーレスポンスを返す
 */
export function errorResponse(
  error: string,
  status: number = 500,
  code?: string
) {
  const response: ApiErrorResponse = { error };
  if (code) {
    response.code = code;
  }
  return NextResponse.json(response, { status });
}

/**
 * バリデーションエラーレスポンスを返す
 */
export function validationErrorResponse(error: string) {
  return errorResponse(error, 400);
}

/**
 * 認証エラーレスポンスを返す
 */
export function unauthorizedResponse(error: string = "認証が必要です") {
  return errorResponse(error, 401);
}

/**
 * 見つからないエラーレスポンスを返す
 */
export function notFoundResponse(error: string = "リソースが見つかりません") {
  return errorResponse(error, 404);
}

