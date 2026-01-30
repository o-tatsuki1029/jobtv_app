import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseUpdate } from "@/lib/actions/supabase-actions";
import type { FormattedReservation } from "@/utils/events/reservation";

type ActionType = "cancelAttendance" | "cancelReservation";

type UseReservationActionsReturn = {
  isProcessing: boolean;
  error: string | null;
  executeAction: (
    reservation: FormattedReservation,
    actionType: ActionType
  ) => Promise<{ success: boolean; error?: string }>;
  reset: () => void;
  getMessage: (actionType: ActionType) => string;
};

/**
 * 予約アクション（出席解除・予約解除）ロジックを管理するカスタムフック
 */
export function useReservationActions(
  onSuccess?: () => void,
  onError?: (message: string) => void
): UseReservationActionsReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeAction = useCallback(
    async (
      reservation: FormattedReservation,
      actionType: ActionType
    ): Promise<{ success: boolean; error?: string }> => {
      setIsProcessing(true);
      setError(null);

      try {
        if (actionType === "cancelAttendance") {
          // 出席登録を解除
          const { error: updateError } = await supabaseUpdate(
            "event_reservations",
            {
              attended: false,
              seat_number: null,
            },
            { id: reservation.id }
          );

          if (updateError) {
            console.error("登録解除エラー:", updateError);
            const errorMessage = "登録解除に失敗しました";
            setError(errorMessage);
            onError?.(errorMessage);
            return { success: false, error: errorMessage };
          }
        } else if (actionType === "cancelReservation") {
          // 予約を解除
          const supabase = createClient();
          const { error: deleteError } = await supabase
            .from("event_reservations")
            .delete()
            .eq("id", reservation.id);

          if (deleteError) {
            console.error("予約解除エラー:", deleteError);
            const errorMessage = "予約解除に失敗しました";
            setError(errorMessage);
            onError?.(errorMessage);
            return { success: false, error: errorMessage };
          }
        }

        onSuccess?.();
        return { success: true };
      } catch (err) {
        console.error("エラー:", err);
        const errorMessage =
          actionType === "cancelAttendance"
            ? "登録解除に失敗しました"
            : "予約解除に失敗しました";
        setError(errorMessage);
        onError?.(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsProcessing(false);
      }
    },
    [onSuccess, onError]
  );

  const getMessage = useCallback((actionType: ActionType): string => {
    if (actionType === "cancelAttendance") {
      return "出席登録を解除しますか？";
    }
    return "この予約を解除しますか？";
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    isProcessing,
    error,
    executeAction,
    reset,
    getMessage,
  };
}

