import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseUpdate } from "@/lib/actions/supabase-actions";
import { parseSeatNumber } from "@/utils/events/reservation";
import type { FormattedReservation } from "@/utils/events/reservation";

type UseCheckInReturn = {
  selectedReservation: FormattedReservation | null;
  seatLetter: string;
  seatNum: string;
  isUpdating: boolean;
  seatError: string;
  setSelectedReservation: (reservation: FormattedReservation | null) => void;
  setSeatLetter: (letter: string) => void;
  setSeatNum: (num: string) => void;
  setSeatError: (error: string) => void;
  initializeSeat: (reservation: FormattedReservation) => void;
  registerAttendance: (
    eventId: string,
    onSuccess: () => void
  ) => Promise<void>;
  reset: () => void;
};

/**
 * 出席登録管理のカスタムフック
 */
export function useCheckIn(): UseCheckInReturn {
  const [selectedReservation, setSelectedReservation] =
    useState<FormattedReservation | null>(null);
  const [seatLetter, setSeatLetter] = useState<string>("");
  const [seatNum, setSeatNum] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [seatError, setSeatError] = useState<string>("");

  const initializeSeat = useCallback((reservation: FormattedReservation) => {
    setSelectedReservation(reservation);
    setSeatError("");

    const parsed = parseSeatNumber(reservation.seat_number);
    if (parsed) {
      setSeatLetter(parsed.letter);
      setSeatNum(parsed.number);
    } else {
      setSeatLetter("");
      setSeatNum("");
    }
  }, []);

  const reset = useCallback(() => {
    setSeatLetter("");
    setSeatNum("");
    setSeatError("");
  }, []);

  const registerAttendance = useCallback(
    async (eventId: string, onSuccess: () => void) => {
      if (!selectedReservation) return;

      if (!seatLetter || !seatNum) {
        setSeatError("アルファベットと数字の両方を選択してください");
        return;
      }

      const newSeatNumber = `${seatLetter}${seatNum}`;
      setSeatError("");
      setIsUpdating(true);

      try {
        // 登録前にデータベースから最新の席番号を取得して重複チェック
        const supabase = createClient();
        const { data: latestReservations, error: checkError } = await supabase
          .from("event_reservations")
          .select("seat_number, id")
          .eq("event_id", eventId)
          .eq("attended", true)
          .not("seat_number", "is", null);

        if (checkError) {
          console.error("席番号確認エラー:", checkError);
          setSeatError("席番号の確認に失敗しました");
          setIsUpdating(false);
          return;
        }

        // 現在編集中の予約を除いて、既存の席番号をチェック
        const existingSeatNumbers = new Set<string>();
        type ReservationItem = {
          id: string;
          seat_number: string | null;
        };
        (latestReservations || []).forEach((r: ReservationItem) => {
          if (r.id !== selectedReservation.id && r.seat_number) {
            existingSeatNumbers.add(r.seat_number);
          }
        });

        // 重複チェック
        if (existingSeatNumbers.has(newSeatNumber)) {
          setSeatError(
            "この席番号は既に登録済みです。別の席番号を選択してください。"
          );
          setIsUpdating(false);
          return;
        }

        // 席番号を登録
        const { error } = await supabaseUpdate(
          "event_reservations",
          {
            seat_number: newSeatNumber,
            attended: true,
          },
          { id: selectedReservation.id }
        );

        if (error) {
          console.error("出席登録エラー:", error);
          setSeatError("出席登録に失敗しました");
        } else {
          reset();
          onSuccess();
        }
      } catch (error) {
        console.error("出席登録エラー:", error);
        setSeatError("出席登録に失敗しました");
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedReservation, seatLetter, seatNum, reset]
  );

  return {
    selectedReservation,
    seatLetter,
    seatNum,
    isUpdating,
    seatError,
    setSelectedReservation,
    setSeatLetter,
    setSeatNum,
    setSeatError,
    initializeSeat,
    registerAttendance,
    reset,
  };
}

