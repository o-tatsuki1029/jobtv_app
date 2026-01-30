"use client";

import { useMemo, useEffect, useState } from "react";
import Modal from "@/components/ui/modals/Modal";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import SeatSelection from "@/components/ui/modals/SeatSelection";
import Button from "@/components/ui/Button";
import { useTriggeredModal } from "@/hooks/useTriggeredModal";
import { useCheckIn } from "@/hooks/useCheckIn";
import { getAvailableLetters, getAvailableNumbers } from "@/utils/events/seat";
import type { FormattedReservation } from "@/utils/events/reservation";

type CheckInModalProps = {
  reservation: FormattedReservation | null;
  eventId: string;
  reservations: FormattedReservation[];
  onSuccess: () => void;
  onOpen?: () => void;
  onClose?: () => void;
};

/**
 * 出席登録モーダルコンポーネント
 * モーダルの開閉状態と予約データを内部で管理
 */
export default function CheckInModal({
  reservation,
  eventId,
  reservations,
  onSuccess,
  onOpen,
  onClose,
}: CheckInModalProps) {
  const { modal, currentData, handleClose } = useTriggeredModal(
    reservation,
    onOpen
  );

  const {
    seatLetter,
    seatNum,
    isUpdating,
    seatError,
    setSeatLetter,
    setSeatNum,
    setSeatError,
    initializeSeat,
    registerAttendance,
    reset,
  } = useCheckIn();

  const [currentStep, setCurrentStep] = useState<
    "letter" | "number" | "confirm"
  >("letter");

  // 予約が選択されたときに席を初期化
  useEffect(() => {
    if (currentData) {
      initializeSeat(currentData);
    }
  }, [currentData, initializeSeat]);

  // モーダルが閉じられたときに状態をリセット
  useEffect(() => {
    if (!modal.isOpen) {
      reset();
    }
  }, [modal.isOpen, reset]);

  // 既存の席番号を取得
  const existingSeatNumbers = useMemo(() => {
    const existing = new Set<string>();
    reservations.forEach((r) => {
      if (r.seat_number && r.attended === "出席") {
        // 現在編集中の予約の席番号は除外
        if (currentData && r.id === currentData.id) {
          return;
        }
        existing.add(r.seat_number);
      }
    });
    return existing;
  }, [reservations, currentData]);

  // 利用可能なアルファベットと数字
  const availableLetters = useMemo(
    () => getAvailableLetters(existingSeatNumbers, seatNum),
    [existingSeatNumbers, seatNum]
  );

  const availableNumbers = useMemo(
    () => getAvailableNumbers(existingSeatNumbers, seatLetter),
    [existingSeatNumbers, seatLetter]
  );

  const handleLetterChange = async (letter: string) => {
    setSeatLetter(letter);
    setSeatNum(""); // アルファベット変更時は数字をリセット
    setSeatError("");
  };

  const handleBack = () => {
    if (currentStep === "confirm") {
      setSeatNum("");
    } else if (currentStep === "number") {
      setSeatLetter("");
      setSeatNum("");
    }
  };

  const handleConfirm = async () => {
    await registerAttendance(eventId, () => {
      reset();
      modal.close();
      onSuccess();
      onClose?.();
    });
  };

  const handleCloseWithReset = () => {
    reset();
    handleClose();
    onClose?.();
  };

  if (!currentData) return null;

  const footerContent = (
    <div style={{ minHeight: '36px' }}>
      {currentStep !== "letter" ? (
        <button
          className="px-4 py-2 bg-gray-100 text-black rounded hover:bg-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleBack}
          disabled={isUpdating}
        >
          戻る
        </button>
      ) : (
        <div></div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={modal.isOpen}
      onClose={handleCloseWithReset}
      footerContent={footerContent}
    >
      <div className="w-full">
        <ModalHeader title="出席登録" />

        <div className="mb-4 space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-semibold">学生名:</div>
              <div>
                {currentData.candidate_name}
                {currentData.candidate_kana && (
                  <span className="text-gray-600">
                    {" "}
                    ({currentData.candidate_kana})
                  </span>
                )}
              </div>
            </div>
            {currentData.school_name && (
              <div>
                <div className="font-semibold">大学名:</div>
                <div>{currentData.school_name}</div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {currentData.phone && (
              <div>
                <div className="font-semibold">電話番号:</div>
                <div>{currentData.phone}</div>
              </div>
            )}
            {currentData.email && (
              <div>
                <div className="font-semibold">メールアドレス:</div>
                <div>{currentData.email}</div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <SeatSelection
            selectedLetter={seatLetter}
            selectedNum={seatNum}
            onLetterChange={handleLetterChange}
            onNumChange={setSeatNum}
            availableLetters={availableLetters}
            availableNumbers={availableNumbers}
            disabled={isUpdating}
            error={seatError}
            onConfirm={handleConfirm}
            isUpdating={isUpdating}
            studentName={currentData.candidate_name}
            onStepChange={setCurrentStep}
            reservations={reservations}
            currentReservationId={currentData?.id}
          />
        </div>
      </div>
    </Modal>
  );
}
