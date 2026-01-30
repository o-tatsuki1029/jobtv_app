"use client";

import { useMasterData } from "@/hooks/useMasterData";

type Props = {
  value: number | "";
  onChange: (value: number | "") => void;
};

export default function GraduationYearFilter({ value, onChange }: Props) {
  const { graduationYears, isLoading } = useMasterData();

  return (
    <label className="block">
      <span className="block text-xs text-gray-600 mb-1">卒年度</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
        className="px-2 py-2 border rounded text-sm min-w-24"
        disabled={isLoading}
      >
        <option value="">すべて</option>
        {graduationYears
          .filter((year) => year.is_active)
          .map((year) => (
            <option key={year.id} value={year.year}>
              {year.year}
          </option>
        ))}
      </select>
    </label>
  );
}
