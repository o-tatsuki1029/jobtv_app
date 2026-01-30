"use client";

import Modal from "@/components/ui/modals/Modal";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import Button from "@/components/ui/Button";

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  type: "success" | "error";
};

export default function MessageModal({
  isOpen,
  onClose,
  message,
  type,
}: MessageModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideFooter={true} maxWidth="md">
      <div className="w-full">
        <ModalHeader title={type === "success" ? "成功" : "エラー"} />
        <p
          className={`mb-6 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="primary">
            OK
          </Button>
        </div>
      </div>
    </Modal>
  );
}
