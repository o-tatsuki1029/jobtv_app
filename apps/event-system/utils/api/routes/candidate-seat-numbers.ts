import { getAdminClient } from "@/lib/supabase/admin";

export async function getCandidateSeatNumbers(eventId: string) {
  if (!eventId) {
    throw new Error("eventIdが必要です");
  }

  // service_roleキーを使用してRLSをバイパス
  const supabase = getAdminClient();

  // 指定されたイベントの席番号一覧を取得（重複を除く）
  const { data, error } = await supabase
    .from("event_reservations")
    .select("seat_number")
    .eq("event_id", eventId)
    .not("seat_number", "is", null);

  if (error) {
    throw new Error("席番号の取得に失敗しました");
  }

  // 席番号を抽出し、重複を除去してソート
  type ReservationItem = { seat_number: string | null };
  const seatNumbers = Array.from(
    new Set(
      (data || []).map((item: ReservationItem) => item.seat_number)
    )
  )
    .filter((seatNumber) => seatNumber !== null && seatNumber !== "")
    .sort((a, b) => {
      // 文字列としてソート（数字の場合は数値順になるように）
      return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });

  return { seatNumbers };
}

