"use client";

import Modal from "@/components/ui/modals/Modal";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import Button from "@/components/ui/Button";
import type { FormattedReservation } from "@/utils/events/reservation";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  reservation: FormattedReservation | null;
  onConfirm: () => void;
  isProcessing?: boolean;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  message,
  reservation,
  onConfirm,
  isProcessing = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideFooter={true} maxWidth="md">
      <div className="w-full">
        <ModalHeader title="確認" />
        <p className="mb-4">{message}</p>
        {reservation && (
          <div className="mb-6 space-y-2">
            {reservation.seat_number && (
              <div>
                <div className="font-semibold">席番号:</div>
                <div className="text-lg">{reservation.seat_number}</div>
              </div>
            )}
            {reservation.candidate_name && (
              <div>
                <div className="font-semibold">氏名:</div>
                <div className="text-lg">{reservation.candidate_name}</div>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <Button onClick={onClose} variant="secondary" disabled={isProcessing}>
            キャンセル
          </Button>
          <Button onClick={onConfirm} variant="danger" disabled={isProcessing}>
            {isProcessing ? "処理中..." : "実行"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
