"use client";

import { useCompanyForm } from "@/hooks/useCompanyForm";
import { Company } from "@/types/company.types";
import { FormField, TextInput } from "@/components/ui/form/FormField";

type CompanyModalFormProps = {
  onClose: () => void;
  initialData?: Company;
};

export default function CompanyModalForm({
  onClose,
  initialData,
}: CompanyModalFormProps) {
  const { form, status, isSubmitting, isEditMode, handleChange, handleSubmit } =
    useCompanyForm({
      initialData,
      onSuccess: onClose,
    });

  return (
    <form onSubmit={handleSubmit} className="w-full pb-6">
      <h2 className="text-xl font-bold mb-6">
        {isEditMode ? "企業編集" : "企業新規作成"}
      </h2>

      <FormField label="企業名">
        <TextInput
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="企業名を入力"
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "送信中..." : isEditMode ? "更新" : "登録"}
      </button>

      {status && <p className="mt-2">{status}</p>}
    </form>
  );
}
