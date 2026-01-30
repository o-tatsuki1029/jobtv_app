import { useState, useCallback } from "react";
import { useModal } from "@/hooks/useModal";
import type { FormattedReservation } from "@/utils/events/reservation";

type UseConfirmModalReturn = {
  modal: ReturnType<typeof useModal>;
  confirmMessage: string;
  confirmReservation: FormattedReservation | null;
  showConfirm: (
    message: string,
    onConfirm: () => void,
    reservation?: FormattedReservation
  ) => void;
  handleConfirm: () => void;
};

/**
 * 確認モーダル管理のカスタムフック
 */
export function useConfirmModal(): UseConfirmModalReturn {
  const modal = useModal();
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(
    null
  );
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmReservation, setConfirmReservation] =
    useState<FormattedReservation | null>(null);

  const showConfirm = useCallback(
    (
      message: string,
      onConfirm: () => void,
      reservation?: FormattedReservation
    ) => {
      setConfirmMessage(message);
      setConfirmAction(() => onConfirm);
      setConfirmReservation(reservation || null);
      modal.open();
    },
    [modal]
  );

  const handleConfirm = useCallback(() => {
    if (confirmAction) {
      confirmAction();
    }
    modal.close();
    setConfirmAction(null);
    setConfirmReservation(null);
  }, [confirmAction, modal]);

  return {
    modal,
    confirmMessage,
    confirmReservation,
    showConfirm,
    handleConfirm,
  };
}

