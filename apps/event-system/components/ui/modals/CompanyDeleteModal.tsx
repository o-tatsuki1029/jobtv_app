"use client";

import { useTriggeredModal } from "@/hooks/useTriggeredModal";
import { useCompanyDelete } from "@/hooks/useCompanyDelete";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";

type Company = {
  id: string;
  name: string;
};

type CompanyDeleteModalProps = {
  company: Company | null;
  onSuccess: () => void;
  onError: (message: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
};

/**
 * 企業登録解除用の確認モーダルコンポーネント
 * モーダルの開閉状態と企業データを内部で管理
 */
export default function CompanyDeleteModal({
  company,
  onSuccess,
  onError,
  onOpen,
  onClose,
}: CompanyDeleteModalProps) {
  const { modal, currentData, handleClose } = useTriggeredModal(
    company,
    onOpen
  );
  const { deleteCompany } = useCompanyDelete(() => {
    onSuccess();
    modal.close();
    onClose?.();
  }, onError);

  if (!currentData) return null;

  const handleConfirm = async () => {
    await deleteCompany(currentData);
  };

  const handleCloseWithCallback = () => {
    handleClose();
    onClose?.();
  };

  return (
    <ConfirmModal
      isOpen={modal.isOpen}
      onClose={handleCloseWithCallback}
      message={`「${currentData.name}」の登録を解除しますか？`}
      reservation={null}
      onConfirm={handleConfirm}
    />
  );
}
