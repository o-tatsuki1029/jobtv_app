"use client";

import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/Button";
import EventReservationImportModal from "@/components/ui/modals/EventReservationImportModal";

export default function AdminHomePage() {
  const importModal = useModal();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HOME</h1>
          <p className="text-muted-foreground mt-2">
            イベント管理システムのホームページ
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={importModal.open}>
          イベント予約取り込み
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">クイックアクセス</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">イベント管理</h3>
            <p className="text-sm text-gray-600">
              イベントの作成・編集・管理を行います
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">学生管理</h3>
            <p className="text-sm text-gray-600">
              学生情報の登録・編集・管理を行います
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold mb-2">企業管理</h3>
            <p className="text-sm text-gray-600">
              企業情報の登録・編集・管理を行います
            </p>
          </div>
        </div>
      </div>

      {/* イベント予約取り込みモーダル */}
      <EventReservationImportModal
        isOpen={importModal.isOpen}
        onClose={importModal.close}
      />
    </div>
  );
}

