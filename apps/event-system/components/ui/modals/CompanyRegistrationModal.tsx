"use client";

import { useEffect } from "react";
import { useCompanyRegistration } from "@/hooks/useCompanyRegistration";
import Modal from "@/components/ui/modals/Modal";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import Button from "@/components/ui/Button";
import type { EventCompany } from "@/utils/events/company";

type CompanyRegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventCompanies: EventCompany[];
  onSuccess: () => void;
  onError: (message: string) => void;
};

/**
 * 企業登録モーダルコンポーネント
 * カスタムフックを内部で使用してpropsを最小化
 */
export default function CompanyRegistrationModal({
  isOpen,
  onClose,
  eventId,
  eventCompanies,
  onSuccess,
  onError,
}: CompanyRegistrationModalProps) {
  const {
    allCompanies,
    selectedCompanyId,
    searchKeyword,
    isRegistering,
    errorMessage,
    filteredCompanies,
    setSearchKeyword,
    setSelectedCompanyId,
    fetchAllCompanies,
    registerCompany,
    reset,
  } = useCompanyRegistration();

  // モーダルが開かれたときに企業一覧を取得
  useEffect(() => {
    if (isOpen && allCompanies.length === 0) {
      fetchAllCompanies();
    }
  }, [isOpen, allCompanies.length, fetchAllCompanies]);

  // モーダルが開かれたときに状態をリセット
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // 登録済み企業IDのセットを作成
  const registeredCompanyIds = new Set(
    eventCompanies.map((ec) => ec.company_id)
  );

  // 未登録の企業のみをフィルタリング
  const unregisteredFilteredCompanies = filteredCompanies.filter(
    (company) => !registeredCompanyIds.has(company.id)
  );

  const handleRegister = async () => {
    const result = await registerCompany(eventId, eventCompanies);
    if (result.success) {
      onSuccess();
      onClose();
    } else if (result.error) {
      onError(result.error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="w-full max-h-[80vh] flex flex-col">
        <ModalHeader title="企業を登録" />

        {/* 検索入力 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">企業名で検索</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            placeholder="企業名を入力..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            disabled={isRegistering}
          />
        </div>

        {/* 企業一覧テーブル */}
        <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg">
          {unregisteredFilteredCompanies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchKeyword
                ? "検索条件に一致する企業が見つかりません"
                : "登録可能な企業がありません"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">企業名</th>
                    <th className="px-4 py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {unregisteredFilteredCompanies.map((company) => (
                    <tr
                      key={company.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedCompanyId === company.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedCompanyId(company.id)}
                    >
                      <td className="px-4 py-2 border-b border-gray-200">
                        {company.name}
                      </td>
                      <td
                        className="px-4 py-2 border-b border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompanyId(company.id);
                          }}
                          variant={
                            selectedCompanyId === company.id
                              ? "primary"
                              : "light"
                          }
                          size="sm"
                        >
                          {selectedCompanyId === company.id ? "選択中" : "選択"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 選択された企業の表示 */}
        {selectedCompanyId && (
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <p className="text-sm font-medium text-blue-900">
              選択中:{" "}
              {
                allCompanies.find((c) => c.id === selectedCompanyId)
                  ?.name
              }
            </p>
          </div>
        )}

        <Button
          onClick={handleRegister}
          disabled={isRegistering || !selectedCompanyId}
          variant="danger"
          size="lg"
          className="w-full"
        >
          {isRegistering ? "登録中..." : "企業を登録"}
        </Button>

        {errorMessage && (
          <div className="mt-3 text-sm text-red-600">{errorMessage}</div>
        )}
      </div>
    </Modal>
  );
}
