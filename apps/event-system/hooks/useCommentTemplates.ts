import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { supabaseDelete } from "@/lib/actions/supabase-actions";
import type { CommentTemplate } from "@/types/commentTemplate.types";

type UseCommentTemplatesReturn = {
  templates: CommentTemplate[];
  isLoading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<{ success: boolean; error?: string }>;
  setError: (error: string | null) => void;
};

/**
 * コメントテンプレート管理のカスタムフック
 */
export function useCommentTemplates(
  companyId: string | null
): UseCommentTemplatesReturn {
  const [templates, setTemplates] = useState<CommentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    if (!companyId) {
      setTemplates([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("comment_templates")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("テンプレート取得エラー:", fetchError);
        setError("テンプレートの取得に失敗しました");
        setTemplates([]);
      } else {
        setTemplates(data || []);
      }
    } catch (err) {
      console.error("予期しないエラー:", err);
      setError("予期しないエラーが発生しました");
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  const deleteTemplate = useCallback(
    async (
      templateId: string
    ): Promise<{ success: boolean; error?: string }> => {
      setError(null);

      try {
        const { error: deleteError } = await supabaseDelete(
          "comment_templates",
          {
            id: templateId,
          }
        );

        if (deleteError) {
          const errorMessage =
            deleteError && typeof deleteError === "object" && "message" in deleteError
              ? String((deleteError as { message: string }).message)
              : "削除に失敗しました";
          setError(errorMessage);
          return { success: false, error: errorMessage };
        }

        return { success: true };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "エラーが発生しました";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    deleteTemplate,
    setError,
  };
}

