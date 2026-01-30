"use client";

import Modal from "@/components/ui/modals/Modal";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import Button from "@/components/ui/Button";

type PasswordDisplayModalProps = {
  isOpen: boolean;
  password: string | null;
  onClose: () => void;
};

/**
 * パスワード表示モーダルコンポーネント
 */
export default function PasswordDisplayModal({
  isOpen,
  password,
  onClose,
}: PasswordDisplayModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full pb-6">
        <ModalHeader title="パスワード" />
        {/* パスワード表示エリア（警告付き） */}
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-gray-700 mb-2">
            このパスワードは今だけ表示されます。必ずメモを取ってください。
          </p>
          <div className="p-3 bg-white border border-gray-300 rounded font-mono text-lg break-all">
            {password}
          </div>
        </div>
        {/* 閉じるボタン */}
        <div className="flex justify-end">
          <Button onClick={onClose}>閉じる</Button>
        </div>
      </div>
    </Modal>
  );
}
