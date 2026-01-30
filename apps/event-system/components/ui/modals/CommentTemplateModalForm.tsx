"use client";

import { useEffect } from "react";
import { useCommentTemplateForm } from "@/hooks/useCommentTemplateForm";
import ModalHeader from "@/components/ui/modals/ModalHeader";
import Button from "@/components/ui/Button";
import type { CommentTemplate } from "@/types/commentTemplate.types";

type CommentTemplateModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  editingTemplate?: CommentTemplate | null;
  onSuccess: () => void;
};

const MAX_TEMPLATE_LENGTH = 60;

/**
 * コメントテンプレートのモーダルフォームコンポーネント
 */
export default function CommentTemplateModalForm({
  isOpen,
  onClose,
  companyId,
  editingTemplate: externalEditingTemplate,
  onSuccess,
}: CommentTemplateModalFormProps) {
  const {
    templateText,
    editingTemplate,
    isSubmitting,
    error,
    setTemplateText,
    setEditingTemplate,
    setError,
    reset,
    submit,
  } = useCommentTemplateForm(() => {
    onSuccess();
    onClose();
  });

  // 外部から編集テンプレートが渡されたときに設定
  useEffect(() => {
    if (externalEditingTemplate) {
      setEditingTemplate(externalEditingTemplate);
      setTemplateText(externalEditingTemplate.template_text);
    } else {
      setEditingTemplate(null);
      setTemplateText("");
    }
  }, [externalEditingTemplate, setEditingTemplate, setTemplateText]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submit(companyId);
    if (!result.success) {
      // エラーはフック内で設定される
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit} className="w-full pb-6">
      <ModalHeader
        title={editingTemplate ? "テンプレート編集" : "テンプレート追加"}
      />

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          テンプレート <span className="text-gray-500">(60字以内)</span>
        </label>
        <textarea
          value={templateText}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= MAX_TEMPLATE_LENGTH) {
              setTemplateText(value);
              setError(null);
            }
          }}
          placeholder="テンプレートを入力（60字以内）"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
          rows={3}
          maxLength={MAX_TEMPLATE_LENGTH}
          required
        />
        <div className="mt-1 text-xs text-gray-500 text-right">
          {templateText.length}/{MAX_TEMPLATE_LENGTH}
        </div>
      </div>

      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={handleClose}
          variant="secondary"
          disabled={isSubmitting}
        >
          戻る
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "送信中..." : editingTemplate ? "更新" : "登録"}
        </Button>
      </div>
    </form>
  );
}
