"use client";

import { useCandidateForm } from "@/hooks/useCandidateForm";
import { Candidate } from "@/types/candidate.types";
import {
  FormField,
  TextInput,
  SelectInput,
  NumberInput,
} from "@/components/ui/form/FormField";

type CandidateModalFormProps = {
  onClose: () => void;
  initialData?: Candidate;
};

export default function CandidateModalForm({
  onClose,
  initialData,
}: CandidateModalFormProps) {
  const {
    form,
    status,
    isSubmitting,
    isEditMode,
    errors,
    handleChange,
    handleSubmit,
  } = useCandidateForm({
    initialData,
    onSuccess: onClose,
  });

  const genderOptions = [
    { value: "男性", label: "男性" },
    { value: "女性", label: "女性" },
    { value: "その他", label: "その他" },
  ];

  const majorFieldOptions = [
    { value: "文系", label: "文系" },
    { value: "理系", label: "理系" },
  ];

  const schoolTypeOptions = [
    { value: "大学", label: "大学" },
    { value: "短大", label: "短大" },
    { value: "専門学校", label: "専門学校" },
    { value: "高等専門学校", label: "高等専門学校" },
    { value: "大学院", label: "大学院" },
    { value: "その他", label: "その他" },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full pb-6">
      <h2 className="text-xl font-bold mb-6">
        {isEditMode ? "学生編集" : "学生新規作成"}
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FormField label="姓" className="w-full">
          <TextInput
            name="last_name"
            value={form.last_name || ""}
            onChange={handleChange}
            placeholder="姓"
          />
          {errors.last_name && (
            <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
          )}
        </FormField>

        <FormField label="名" className="w-full">
          <TextInput
            name="first_name"
            value={form.first_name || ""}
            onChange={handleChange}
            placeholder="名"
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
          )}
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FormField label="姓（カナ）" className="w-full">
          <TextInput
            name="last_name_kana"
            value={form.last_name_kana || ""}
            onChange={handleChange}
            placeholder="セイ"
          />
          {errors.last_name_kana && (
            <p className="text-red-500 text-xs mt-1">{errors.last_name_kana}</p>
          )}
        </FormField>

        <FormField label="名（カナ）" className="w-full">
          <TextInput
            name="first_name_kana"
            value={form.first_name_kana || ""}
            onChange={handleChange}
            placeholder="メイ"
          />
          {errors.first_name_kana && (
            <p className="text-red-500 text-xs mt-1">
              {errors.first_name_kana}
            </p>
          )}
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FormField label="卒業年度" className="w-full">
          <NumberInput
            name="graduation_year"
            value={form.graduation_year || 0}
            onChange={handleChange}
            min={2000}
            max={2100}
            placeholder="例: 2027"
          />
          {errors.graduation_year && (
            <p className="text-red-500 text-xs mt-1">
              {errors.graduation_year}
            </p>
          )}
        </FormField>

        <FormField label="性別" className="w-full">
          <SelectInput
            name="gender"
            value={form.gender || ""}
            onChange={handleChange}
            options={genderOptions}
            placeholder="性別を選択"
          />
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </FormField>
      </div>

      <FormField label="メールアドレス">
        <TextInput
          name="email"
          type="email"
          value={form.email || ""}
          onChange={handleChange}
          placeholder="email@example.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </FormField>

      <FormField label="電話番号">
        <TextInput
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          placeholder="090-1234-5678"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </FormField>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FormField label="学校種別" className="w-full">
          <SelectInput
            name="school_type"
            value={form.school_type || ""}
            onChange={handleChange}
            options={schoolTypeOptions}
            placeholder="学校種別を選択"
          />
          {errors.school_type && (
            <p className="text-red-500 text-xs mt-1">{errors.school_type}</p>
          )}
        </FormField>
        <FormField label="学校名" className="w-full">
          <TextInput
            name="school_name"
            value={form.school_name || ""}
            onChange={handleChange}
            placeholder="学校名を入力"
          />
          {errors.school_name && (
            <p className="text-red-500 text-xs mt-1">{errors.school_name}</p>
          )}
        </FormField>
      </div>

      <FormField label="文理">
        <SelectInput
          name="major_field"
          value={form.major_field || ""}
          onChange={handleChange}
          options={majorFieldOptions}
          placeholder="文理を選択"
        />
        {errors.major_field && (
          <p className="text-red-500 text-xs mt-1">{errors.major_field}</p>
        )}
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
