import { useState, useEffect } from "react";
import { supabaseInsert, supabaseUpdate } from "@/lib/actions/supabase-actions";
import { Company, CompanyFormData } from "@/types/company.types";

type UseCompanyFormProps = {
  initialData?: Company;
  onSuccess?: () => void;
};

const initialFormState: CompanyFormData = {
  name: "",
};

export function useCompanyForm({ initialData, onSuccess }: UseCompanyFormProps) {
  const [form, setForm] = useState<CompanyFormData>(initialFormState);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!initialData?.id;

  // フォーム初期化
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
      });
    } else {
      setForm(initialFormState);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("送信中...");

    try {
      if (isEditMode && initialData?.id) {
        const updateData = {
          ...form,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabaseUpdate("companies", updateData, {
          id: initialData.id,
        });

        if (error) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "エラーが発生しました";
          setStatus("エラー: " + errorMessage);
        } else {
          setStatus("更新しました！");
          onSuccess?.();
        }
      } else {
        const { data, error } = await supabaseInsert("companies", form);

        if (error) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "エラーが発生しました";
          setStatus("エラー: " + errorMessage);
        } else {
          setStatus("登録しました！ID: " + data?.id);
          setForm(initialFormState);
          onSuccess?.();
        }
      }
    } catch {
      setStatus("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    status,
    isSubmitting,
    isEditMode,
    handleChange,
    handleSubmit,
  };
}

