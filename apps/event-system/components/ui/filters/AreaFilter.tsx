"use client";

import { useMasterData } from "@/hooks/useMasterData";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AreaFilter({ value, onChange }: Props) {
  const { areas, isLoading } = useMasterData();

  return (
    <label className="block">
      <span className="block text-xs text-gray-600 mb-1">エリア</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-2 border rounded text-sm min-w-28"
        disabled={isLoading}
      >
        <option value="">すべて</option>
        {areas
          .filter((area) => area.is_active)
          .map((area) => (
            <option key={area.id} value={area.name}>
              {area.name}
          </option>
        ))}
      </select>
    </label>
  );
}
