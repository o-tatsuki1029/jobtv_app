"use client";

import { useEffect } from "react";
import { useBulkRegistration } from "@/hooks/useBulkRegistration";
import Modal from "@/components/ui/modals/Modal";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import Button from "@/components/ui/Button";
import type { FormattedReservation } from "@/utils/events/reservation";

type BulkRegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  reservations: FormattedReservation[];
  onSuccess: () => void;
  onError: (message: string) => void;
};

/**
 * 一括登録モーダルコンポーネント
 * カスタムフックを内部で使用してpropsを最小化
 */
export default function BulkRegistrationModal({
  isOpen,
  onClose,
  eventId,
  reservations,
  onSuccess,
  onError,
}: BulkRegistrationModalProps) {
  const {
    allJobSeekers,
    selectedJobSeekerIds,
    searchKeyword,
    isRegistering,
    registrationResult,
    filteredJobSeekers,
    setSearchKeyword,
    toggleSelection,
    clearSelection,
    fetchAllJobSeekers,
    registerBulk,
    reset,
  } = useBulkRegistration();

  // モーダルが開かれたときに学生一覧を取得
  useEffect(() => {
    if (isOpen && allJobSeekers.length === 0) {
      fetchAllJobSeekers();
    }
  }, [isOpen, allJobSeekers.length, fetchAllJobSeekers]);

  // 既に予約済みの学生IDを取得
  const reservedJobSeekerIds = new Set(
    reservations.map((r) => r.candidate_id).filter(Boolean)
  );

  const handleRegister = async () => {
    if (selectedJobSeekerIds.size === 0) {
      onError("学生を選択してください");
      return;
    }

    const result = await registerBulk(eventId, reservations);
    const totalSelected = selectedJobSeekerIds.size;

    if (result.success > 0) {
      clearSelection();
      onSuccess();
      if (result.success === totalSelected) {
        // 全て成功した場合のみモーダルを閉じる
        setTimeout(() => {
          reset();
          onClose();
        }, 2000);
      }
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="4xl">
      <div className="w-full">
        <ModalHeader title="学生を予約登録" />

        {/* 検索欄 */}
        <div className="mb-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="名前、フリガナ、メールアドレス、大学名で検索"
            className="w-full px-3 py-2 border rounded"
            disabled={isRegistering}
          />
        </div>

        {/* 選択中の学生数表示 */}
        {selectedJobSeekerIds.size > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm font-semibold text-blue-800">
              選択中: {selectedJobSeekerIds.size}名
            </p>
            <div className="mt-2 text-xs text-blue-600">
              {Array.from(selectedJobSeekerIds)
                .slice(0, 5)
                .map((id) => {
                  const js = allJobSeekers.find((j) => j.id === id);
                  return js ? `${js.last_name} ${js.first_name}` : id;
                })
                .join(", ")}
              {selectedJobSeekerIds.size > 5 && "..."}
            </div>
          </div>
        )}

        {/* 学生一覧テーブル */}
        <div className="mb-4 border rounded max-h-[400px] overflow-y-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold border-b">
                  選択
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold border-b">
                  学生名
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold border-b">
                  フリガナ
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold border-b">
                  メールアドレス
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold border-b">
                  大学名
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold border-b">
                  状態
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredJobSeekers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {searchKeyword.trim()
                      ? "検索結果がありません"
                      : "学生が登録されていません"}
                  </td>
                </tr>
              ) : (
                filteredJobSeekers.map((js) => {
                  const isReserved = reservedJobSeekerIds.has(js.id);
                  const isSelected = selectedJobSeekerIds.has(js.id);
                  const handleRowClick = () => {
                    if (!isRegistering && !isReserved) {
                      toggleSelection(js.id);
                    }
                  };
                  return (
                    <tr
                      key={js.id}
                      onClick={handleRowClick}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        isReserved ? "bg-gray-100 opacity-60 cursor-not-allowed" : ""
                      } ${isSelected ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-4 py-2 border-b" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(js.id)}
                          disabled={isRegistering || isReserved}
                          className="cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {js.last_name} {js.first_name}
                      </td>
                      <td className="px-4 py-2 border-b text-sm text-gray-600">
                        {js.last_name_kana} {js.first_name_kana}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {js.email || "-"}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {js.school_name || "-"}
                      </td>
                      <td className="px-4 py-2 border-b text-sm">
                        {isReserved ? (
                          <span className="text-red-600 font-semibold">
                            予約済み
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Button
          onClick={handleRegister}
          disabled={isRegistering || selectedJobSeekerIds.size === 0}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isRegistering
            ? "登録中..."
            : `選択した${selectedJobSeekerIds.size}名を予約登録`}
        </Button>

        {registrationResult && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h4 className="font-semibold mb-2">登録結果</h4>
            <p className="text-green-600">
              成功: {registrationResult.success}件
            </p>
            <p className="text-red-600">失敗: {registrationResult.failed}件</p>
            {registrationResult.errors.length > 0 && (
              <div className="mt-3">
                <p className="font-semibold mb-1">エラー詳細:</p>
                <ul className="list-disc list-inside text-sm text-red-600 max-h-40 overflow-y-auto">
                  {registrationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
