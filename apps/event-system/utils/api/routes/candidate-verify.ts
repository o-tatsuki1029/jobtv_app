import { cookies } from "next/headers";
import { getAdminClient } from "@jobtv-app/shared/supabase/admin";
import { sanitizeString, isValidUUID } from "@/utils/validation/sanitize";
import { checkRateLimit } from "@/utils/validation/rate-limit";
import { headers } from "next/headers";

export async function verifyCandidate(
  eventId: string,
  seatNumber: string,
  phoneNumber: string
) {
  // レート制限チェック（IPアドレスベース）
  const headersList = await headers();
  const ipAddress = headersList.get("x-forwarded-for") || 
                    headersList.get("x-real-ip") || 
                    "unknown";
  const rateLimitKey = `verify:${ipAddress}`;
  
  if (!checkRateLimit(rateLimitKey, 5, 60000)) { // 1分間に5回まで
    throw new Error("リクエストが多すぎます。しばらく待ってから再度お試しください。");
  }
  
  // 入力値の検証とサニタイゼーション
  if (!eventId || !isValidUUID(eventId)) {
    throw new Error("無効なイベントIDです");
  }
  
  const sanitizedSeatNumber = sanitizeString(seatNumber);
  if (!sanitizedSeatNumber || sanitizedSeatNumber.length === 0) {
    throw new Error("席番号を入力してください");
  }
  if (sanitizedSeatNumber.length > 20) {
    throw new Error("席番号が長すぎます");
  }
  
  const sanitizedPhoneNumber = sanitizeString(phoneNumber);
  if (!sanitizedPhoneNumber || sanitizedPhoneNumber.length === 0) {
    throw new Error("電話番号を入力してください");
  }
  // 電話番号の形式チェック（数字、ハイフン、括弧のみ）
  if (!/^[\d\-\(\)]+$/.test(sanitizedPhoneNumber)) {
    throw new Error("無効な電話番号形式です");
  }
  if (sanitizedPhoneNumber.length > 20) {
    throw new Error("電話番号が長すぎます");
  }

  // service_roleキーを使用してRLSをバイパス
  const supabase = getAdminClient();

  // event_reservationsとcandidatesをJOINして検証
  const { data, error } = await supabase
    .from("event_reservations")
    .select(`
      candidate_id,
      candidates!inner (
        phone
      )
    `)
    .eq("event_id", eventId)
    .eq("seat_number", sanitizedSeatNumber)
    .eq("candidates.phone", sanitizedPhoneNumber)
    .single();

  if (error || !data) {
    throw new Error("イベント、席番号、電話番号が一致しません");
  }

  // クッキーにcandidate_idを保存
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  cookieStore.set("candidate_id", data.candidate_id, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7日間
    path: "/",
  });
  cookieStore.set("candidate_event_id", eventId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return {
    success: true,
    candidateId: data.candidate_id,
  };
}

