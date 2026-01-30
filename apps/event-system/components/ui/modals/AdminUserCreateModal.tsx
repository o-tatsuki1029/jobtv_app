"use client";

import { useState } from "react";
import Modal from "@/components/ui/modals/Modal";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import { FormField, TextInput } from "@/components/ui/form/FormField";
import Button from "@/components/ui/Button";
import { createAdminUser } from "@/lib/actions/admin-users-actions";

type AdminUserCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (password?: string) => void;
  onError: (error: string) => void;
};

/**
 * 管理者アカウント作成モーダルコンポーネント
 */
export default function AdminUserCreateModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: AdminUserCreateModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム送信処理: 管理者アカウントを作成
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email.trim()) {
      setError("メールアドレスを入力してください");
      setIsSubmitting(false);
      return;
    }

    const result = await createAdminUser(email.trim(), password || "");

    if (result.success) {
      setEmail("");
      setPassword("");
      onSuccess(result.password || undefined);
      onClose();
    } else {
      const errorMessage =
        result.error || "管理者アカウントの作成に失敗しました";
      setError(errorMessage);
      onError(errorMessage);
    }

    setIsSubmitting(false);
  };

  // モーダルを閉じる処理: フォーム状態をリセット
  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} hideFooter>
      <form onSubmit={handleSubmit} className="w-full pb-6">
        <ModalHeader title="管理者アカウント作成" />

        {/* メールアドレス入力フィールド */}
        <FormField label="メールアドレス" className="mb-5">
          <TextInput
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="admin@example.com"
            required
          />
        </FormField>

        {/* パスワード入力フィールド（任意） */}
        <FormField label="パスワード（任意）" className="mb-5">
          <TextInput
            name="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="未入力の場合は自動生成されます"
          />
          <p className="text-xs text-gray-500 mt-1">
            パスワードを入力しない場合、自動生成されたパスワードが表示されます
          </p>
        </FormField>

        {/* エラー表示 */}
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        {/* アクションボタン */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            キャンセル
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "作成中..." : "作成"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
