import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type CompanyOption = {
  id: string;
  name: string;
};

type UseCompanySelectionReturn = {
  allCompanies: CompanyOption[];
  selectedCompanyId: string;
  selectedCompany: CompanyOption | null;
  isLoading: boolean;
  error: string | null;
  setSelectedCompanyId: (id: string) => void;
  setError: (error: string | null) => void;
  fetchCompanies: () => Promise<void>;
};

/**
 * 企業選択管理のカスタムフック
 */
export function useCompanySelection(
  initialCompanyId?: string
): UseCompanySelectionReturn {
  const [allCompanies, setAllCompanies] = useState<CompanyOption[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialCompanyId || ""
  );
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("companies")
        .select("id, name")
        .order("name", { ascending: true });

      if (fetchError) {
        console.error("企業一覧取得エラー:", fetchError);
        setError("企業一覧の取得に失敗しました");
        setAllCompanies([]);
      } else {
        setAllCompanies(data || []);
      }
    } catch (err) {
      console.error("予期しないエラー:", err);
      setError("予期しないエラーが発生しました");
      setAllCompanies([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 選択された企業IDが変更されたら、企業情報を取得
  useEffect(() => {
    if (selectedCompanyId) {
      const company = allCompanies.find((c) => c.id === selectedCompanyId);
      setSelectedCompany(company || null);
    } else {
      setSelectedCompany(null);
    }
  }, [selectedCompanyId, allCompanies]);

  // 初期化時に企業一覧を取得
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    allCompanies,
    selectedCompanyId,
    selectedCompany,
    isLoading,
    error,
    setSelectedCompanyId,
    setError,
    fetchCompanies,
  };
}

