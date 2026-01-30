import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type Company = {
  id: string;
  name: string;
};

type UseCompanyDeleteReturn = {
  isDeleting: boolean;
  error: string | null;
  deleteCompany: (company: Company) => Promise<{ success: boolean; error?: string }>;
  reset: () => void;
};

/**
 * 企業削除ロジックを管理するカスタムフック
 */
export function useCompanyDelete(
  onSuccess?: () => void,
  onError?: (message: string) => void
): UseCompanyDeleteReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCompany = useCallback(
    async (company: Company): Promise<{ success: boolean; error?: string }> => {
      setIsDeleting(true);
      setError(null);

      try {
        const supabase = createClient();
        const { error: deleteError } = await supabase
          .from("event_companies")
          .delete()
          .eq("id", company.id);

        if (deleteError) {
          console.error("削除エラー:", deleteError);
          const errorMessage = "削除に失敗しました";
          setError(errorMessage);
          onError?.(errorMessage);
          return { success: false, error: errorMessage };
        }

        onSuccess?.();
        return { success: true };
      } catch (err) {
        console.error("削除エラー:", err);
        const errorMessage = "削除に失敗しました";
        setError(errorMessage);
        onError?.(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsDeleting(false);
      }
    },
    [onSuccess, onError]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsDeleting(false);
  }, []);

  return {
    isDeleting,
    error,
    deleteCompany,
    reset,
  };
}

