"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Table from "@/components/ui/table/Table";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { formatEventDisplay } from "@/utils/data/event";
import { useEventReservations } from "@/hooks/useEventReservations";
import { useMessageModal } from "@/hooks/useMessageModal";
import BulkRegistrationModal from "@/components/ui/modals/BulkRegistrationModal";
import CheckInModal from "@/components/ui/modals/CheckInModal";
import ReservationActionsModal from "@/components/ui/modals/ReservationActionsModal";
import MessageModal from "@/components/ui/modals/MessageModal";
import type { FormattedReservation } from "@/utils/events/reservation";

export default function EventReservationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // カスタムフック
  const { event, reservations, isLoading, fetchEvent, fetchReservations } =
    useEventReservations(eventId);

  const bulkModal = useModal();

  // モーダルで使用する予約データとアクションタイプを管理
  const [selectedReservationForCheckIn, setSelectedReservationForCheckIn] =
    useState<FormattedReservation | null>(null);
  const [selectedReservationForAction, setSelectedReservationForAction] =
    useState<FormattedReservation | null>(null);
  const [actionType, setActionType] = useState<
    "cancelAttendance" | "cancelReservation"
  >("cancelAttendance");


  const {
    modal: messageModal,
    messageText,
    messageType,
    showMessage,
  } = useMessageModal();

  useEffect(() => {
    fetchEvent();
    fetchReservations();
  }, [eventId, fetchEvent, fetchReservations]);

  const handleReservationActionSuccess = () => {
    fetchReservations();
  };

  const handleReservationActionError = (message: string) => {
    showMessage(message, "error");
  };

  const handleBulkRegistrationSuccess = () => {
    fetchReservations();
  };

  const handleBulkRegistrationError = (message: string) => {
    showMessage(message, "error");
  };

  // テーブルヘッダー定義
  const reservationHeaders: {
    label: string;
    key: keyof FormattedReservation;
    renderCell?: (value: unknown, row: FormattedReservation) => React.ReactNode;
  }[] = [
    { label: "席番号", key: "seat_number" },
    { label: "学生名", key: "candidate_name" },
    { label: "フリガナ", key: "candidate_kana" },
    { label: "電話番号", key: "phone" },
    { label: "メールアドレス", key: "email" },
    { label: "大学名", key: "school_name" },
    {
      label: "性別",
      key: "gender" as keyof FormattedReservation,
      renderCell: (value: unknown) => {
        const gender = value as string | null;
        if (!gender) return "-";
        return gender;
      },
    },
  ];

  return (
    <div>
      {/* 学生追加モーダル */}
      <BulkRegistrationModal
        isOpen={bulkModal.isOpen}
        onClose={bulkModal.close}
        eventId={eventId}
        reservations={reservations}
        onSuccess={handleBulkRegistrationSuccess}
        onError={handleBulkRegistrationError}
      />

      {/* 出席登録モーダル */}
      <CheckInModal
        reservation={selectedReservationForCheckIn}
        eventId={eventId}
        reservations={reservations}
        onSuccess={fetchReservations}
        onOpen={() => {
          // モーダルが開かれたときの処理（必要に応じて）
        }}
        onClose={() => {
          setSelectedReservationForCheckIn(null);
        }}
      />

      {/* 予約アクションモーダル（出席解除・予約解除） */}
      <ReservationActionsModal
        reservation={selectedReservationForAction}
        actionType={actionType}
        onSuccess={handleReservationActionSuccess}
        onError={handleReservationActionError}
        onOpen={() => {
          // モーダルが開かれたときの処理（必要に応じて）
        }}
        onClose={() => {
          setSelectedReservationForAction(null);
        }}
      />

      {/* メッセージモーダル */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={messageModal.close}
        message={messageText}
        type={messageType}
      />

      <h2 className="text-xl font-semibold mb-4">イベント予約登録</h2>

      <div className="flex my-5 gap-10 font-bold items-center">
        <p>
          対象イベント：
          {event ? formatEventDisplay(event) : "読み込み中..."}
        </p>
        <Button
          onClick={() => router.push("/admin/event")}
          variant="light"
          size="sm"
        >
          戻る
        </Button>
      </div>

      {/* 予約済み学生一覧 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            予約済み学生一覧 ({reservations.length}名)
          </h3>
          <Button onClick={bulkModal.open} variant="success" size="lg">
            ＋学生を予約登録
          </Button>
        </div>
        <Table
          headers={reservationHeaders}
          data={reservations}
          isLoading={isLoading}
          renderActions={(row) => {
            const reservation = row as FormattedReservation;
            return (
              <div className="flex gap-2 justify-end">
                {reservation.attended === "出席" ? (
                  <Button
                    onClick={() => {
                      setSelectedReservationForAction(reservation);
                      setActionType("cancelAttendance");
                    }}
                    variant="light"
                    size="sm"
                  >
                    出席解除
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSelectedReservationForCheckIn(reservation);
                    }}
                    variant="danger"
                    size="sm"
                  >
                    出席登録
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setSelectedReservationForAction(reservation);
                    setActionType("cancelReservation");
                  }}
                  variant="secondary"
                  size="sm"
                >
                  予約解除
                </Button>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
