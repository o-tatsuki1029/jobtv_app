"use client";

import { useTriggeredModal } from "@/hooks/useTriggeredModal";
import { useReservationActions } from "@/hooks/useReservationActions";
import ConfirmModal from "./ConfirmModal";
import type { FormattedReservation } from "@/utils/events/reservation";

type ActionType = "cancelAttendance" | "cancelReservation";

type TriggerData = {
  reservation: FormattedReservation;
  actionType: ActionType;
};

type ReservationActionsModalProps = {
  reservation: FormattedReservation | null;
  actionType: ActionType;
  onSuccess: () => void;
  onError: (message: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

/**
 * 予約アクション（出席解除・予約解除）用の確認モーダルコンポーネント
 * モーダルの開閉状態と予約データを内部で管理
 */
export default function ReservationActionsModal({
  reservation,
  actionType,
  onSuccess,
  onError,
  onOpen,
  onClose,
}: ReservationActionsModalProps) {
  const trigger: TriggerData | null = reservation
    ? { reservation, actionType }
    : null;

  const { modal, currentData, handleClose } = useTriggeredModal(
    trigger,
    onOpen
  );
  const { executeAction, getMessage } = useReservationActions(() => {
    onSuccess();
    modal.close();
    onClose?.();
  }, onError);

  if (!currentData) return null;

  const handleConfirm = async () => {
    await executeAction(currentData.reservation, currentData.actionType);
  };

  const handleCloseWithCallback = () => {
    handleClose();
    onClose?.();
  };

  return (
    <ConfirmModal
      isOpen={modal.isOpen}
      onClose={handleCloseWithCallback}
      message={getMessage(currentData.actionType)}
      reservation={currentData.reservation}
      onConfirm={handleConfirm}
    />
  );
}
