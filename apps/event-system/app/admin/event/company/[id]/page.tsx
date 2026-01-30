"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Table from "@/components/ui/table/Table";
import Button from "@/components/ui/Button";
import { useModal } from "@/hooks/useModal";
import { useMessageModal } from "@/hooks/useMessageModal";
import { formatEventDisplay } from "@/utils/data/event";
import { useEventCompanies } from "@/hooks/useEventCompanies";
import CompanyRegistrationModal from "@/components/ui/modals/CompanyRegistrationModal";
import CompanyDeleteModal from "@/components/ui/modals/CompanyDeleteModal";
import MessageModal from "@/components/ui/modals/MessageModal";
import type { EventCompany } from "@/utils/events/company";

const companyHeaders: {
  label: string;
  key: keyof EventCompany;
}[] = [
  { label: "企業名", key: "name" },
  { label: "登録日", key: "created_at" },
];

export default function EventCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // カスタムフック
  const { event, eventCompanies, isLoading, fetchEvent, fetchEventCompanies } =
    useEventCompanies(eventId);

  const registrationModal = useModal();

  // 削除対象の企業を管理
  const [selectedCompanyForDelete, setSelectedCompanyForDelete] =
    useState<EventCompany | null>(null);

  const {
    modal: messageModal,
    messageText,
    messageType,
    showMessage,
  } = useMessageModal();

  useEffect(() => {
    fetchEvent();
    fetchEventCompanies();
  }, [eventId, fetchEvent, fetchEventCompanies]);

  const handleDeleteSuccess = () => {
    setSelectedCompanyForDelete(null); // 選択をクリア
    fetchEventCompanies();
    showMessage("企業の登録を解除しました", "success");
  };

  const handleDeleteError = (message: string) => {
    setSelectedCompanyForDelete(null); // エラー時も選択をクリア
    showMessage(message, "error");
  };

  const handleRegistrationSuccess = () => {
    fetchEventCompanies();
  };

  const handleRegistrationError = (message: string) => {
    showMessage(message, "error");
  };

  return (
    <div>
      {/* 企業登録モーダル */}
      <CompanyRegistrationModal
        isOpen={registrationModal.isOpen}
        onClose={registrationModal.close}
        eventId={eventId}
        eventCompanies={eventCompanies}
        onSuccess={handleRegistrationSuccess}
        onError={handleRegistrationError}
      />

      {/* 企業削除モーダル */}
      <CompanyDeleteModal
        company={selectedCompanyForDelete}
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
        onOpen={() => {
          // モーダルが開かれたときの処理（必要に応じて）
        }}
        onClose={() => {
          setSelectedCompanyForDelete(null);
        }}
      />

      {/* メッセージモーダル */}
      <MessageModal
        isOpen={messageModal.isOpen}
        onClose={messageModal.close}
        message={messageText}
        type={messageType}
      />

      <h2 className="text-xl font-semibold mb-4">イベント企業登録</h2>

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

      {/* 登録済み企業一覧 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            登録済み企業一覧 ({eventCompanies.length}社)
          </h3>
          <Button onClick={registrationModal.open} variant="danger" size="lg">
            ＋企業を登録
          </Button>
        </div>
        <Table
          headers={companyHeaders}
          data={eventCompanies}
          isLoading={isLoading}
          renderActions={(row) => {
            const company = row as EventCompany;
            return (
              <Button
                onClick={() => {
                  setSelectedCompanyForDelete(company);
                }}
                variant="secondary"
                size="sm"
              >
                登録解除
              </Button>
            );
          }}
        />
      </div>
    </div>
  );
}
