import { useState, useCallback } from "react";
import {
  supabaseInsert,
  supabaseUpdate,
} from "@/lib/actions/supabase-actions";
import type { CommentTemplate } from "@/types/commentTemplate.types";

type UseCommentTemplateFormReturn = {
  templateText: string;
  editingTemplate: CommentTemplate | null;
  isSubmitting: boolean;
  error: string | null;
  setTemplateText: (text: string) => void;
  setEditingTemplate: (template: CommentTemplate | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  submit: (
    companyId: string
  ) => Promise<{ success: boolean; error?: string }>;
};

const MAX_TEMPLATE_LENGTH = 60;

/**
 * コメントテンプレートフォーム管理のカスタムフック
 */
export function useCommentTemplateForm(
  onSuccess?: () => void
): UseCommentTemplateFormReturn {
  const [templateText, setTemplateText] = useState("");
  const [editingTemplate, setEditingTemplate] =
    useState<CommentTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setTemplateText("");
    setEditingTemplate(null);
    setError(null);
  }, []);

  const submit = useCallback(
    async (
      companyId: string
    ): Promise<{ success: boolean; error?: string }> => {
      setError(null);

      // バリデーション
      if (!templateText.trim()) {
        const errorMessage = "テンプレートを入力してください";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      if (templateText.length > MAX_TEMPLATE_LENGTH) {
        const errorMessage = "テンプレートは60字以内で入力してください";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }

      setIsSubmitting(true);

      try {
        if (editingTemplate) {
          // 更新
          const { error: updateError } = await supabaseUpdate(
            "comment_templates",
            { template_text: templateText.trim() },
            { id: editingTemplate.id }
          );

          if (updateError) {
            const errorMessage =
              updateError && typeof updateError === "object" && "message" in updateError
                ? String((updateError as { message: string }).message)
                : "更新に失敗しました";
            setError(errorMessage);
            setIsSubmitting(false);
            return { success: false, error: errorMessage };
          }
        } else {
          // 新規作成
          const { error: insertError } = await supabaseInsert(
            "comment_templates",
            {
              company_id: companyId,
              template_text: templateText.trim(),
            }
          );

          if (insertError) {
            const errorMessage =
              insertError && typeof insertError === "object" && "message" in insertError
                ? String((insertError as { message: string }).message)
                : "登録に失敗しました";
            setError(errorMessage);
            setIsSubmitting(false);
            return { success: false, error: errorMessage };
          }
        }

        reset();
        onSuccess?.();
        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "エラーが発生しました";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSubmitting(false);
      }
    },
    [templateText, editingTemplate, onSuccess, reset]
  );

  return {
    templateText,
    editingTemplate,
    isSubmitting,
    error,
    setTemplateText,
    setEditingTemplate,
    setError,
    reset,
    submit,
  };
}

