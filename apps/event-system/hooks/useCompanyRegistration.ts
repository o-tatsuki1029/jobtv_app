import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Company } from "@/types/company.types";
import { supabaseInsert } from "@/lib/actions/supabase-actions";
import { filterCompanies } from "@/utils/data/company";
import type { EventCompany } from "@/utils/events/company";

type UseCompanyRegistrationReturn = {
  allCompanies: Company[];
  selectedCompanyId: string;
  searchKeyword: string;
  isRegistering: boolean;
  errorMessage: string;
  filteredCompanies: Company[];
  setSearchKeyword: (keyword: string) => void;
  setSelectedCompanyId: (companyId: string) => void;
  setErrorMessage: (message: string) => void;
  fetchAllCompanies: () => Promise<void>;
  registerCompany: (
    eventId: string,
    eventCompanies: EventCompany[]
  ) => Promise<{ success: boolean; error?: string }>;
  reset: () => void;
};

/**
 * 企業登録管理のカスタムフック
 */
export function useCompanyRegistration(): UseCompanyRegistrationReturn {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchAllCompanies = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("企業一覧取得エラー:", error);
      return;
    }

    setAllCompanies(data || []);
  }, []);

  const reset = useCallback(() => {
    setSelectedCompanyId("");
    setSearchKeyword("");
    setErrorMessage("");
  }, []);

  const registerCompany = useCallback(
    async (
      eventId: string,
      eventCompanies: EventCompany[]
    ): Promise<{ success: boolean; error?: string }> => {
      setErrorMessage("");

      if (!selectedCompanyId) {
        const error = "企業を選択してください";
        setErrorMessage(error);
        return { success: false, error };
      }

      // 選択された企業が存在するか確認
      const selectedCompany = allCompanies.find(
        (c) => c.id === selectedCompanyId
      );
      if (!selectedCompany) {
        const error = "選択された企業が見つかりません。再度選択してください。";
        setErrorMessage(error);
        return { success: false, error };
      }

      // 既に登録されているかチェック
      const alreadyRegistered = eventCompanies.some(
        (ec) => ec.company_id === selectedCompanyId
      );

      if (alreadyRegistered) {
        const error = "この企業は既に登録されています";
        setErrorMessage(error);
        return { success: false, error };
      }

      setIsRegistering(true);
      try {
        const { error } = await supabaseInsert("event_companies", {
          event_id: eventId,
          company_id: selectedCompanyId,
        });

        if (error) {
          console.error("企業登録エラー:", error);
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "企業登録に失敗しました。再度お試しください。";
          let errorMsg = errorMessage;
          
          // 外部キー制約違反のエラーメッセージを分かりやすくする
          if (errorMessage.includes("foreign key constraint")) {
            errorMsg = "データベースの制約エラーが発生しました。管理者に連絡してください。";
          }
          
          setErrorMessage(errorMsg);
          return { success: false, error: errorMsg };
        }

        reset();
        return { success: true };
      } catch (error: unknown) {
        console.error("企業登録エラー:", error);
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? String((error as { message: string }).message)
            : "企業登録に失敗しました。再度お試しください。";
        let errorMsg = errorMessage;
        
        if (errorMessage.includes("foreign key constraint")) {
          errorMsg = "データベースの制約エラーが発生しました。管理者に連絡してください。";
        }
        
        setErrorMessage(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsRegistering(false);
      }
    },
    [selectedCompanyId, allCompanies, reset]
  );

  const filteredCompanies = filterCompanies(allCompanies, searchKeyword);

  return {
    allCompanies,
    selectedCompanyId,
    searchKeyword,
    isRegistering,
    errorMessage,
    filteredCompanies,
    setSearchKeyword,
    setSelectedCompanyId,
    setErrorMessage,
    fetchAllCompanies,
    registerCompany,
    reset,
  };
}

