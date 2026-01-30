type Props = {
  from: string;
  to: string;
  onChange: (next: { from: string; to: string }) => void;
  onClearAll?: () => void; // 全体クリア用（任意）
};

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DateRangeFilter({
  from,
  to,
  onChange,
  onClearAll,
}: Props) {
  const today = new Date();

  return (
    <div className="flex items-end gap-2">
      <label className="block">
        <span className="block text-xs text-gray-600 mb-1">開催日（自）</span>
        <input
          type="date"
          value={from}
          onChange={(e) => onChange({ from: e.target.value, to })}
          className="px-2 py-2 border rounded text-sm"
        />
      </label>
      <label className="block">
        <span className="block text-xs text-gray-600 mb-1">開催日（至）</span>
        <input
          type="date"
          value={to}
          onChange={(e) => onChange({ from, to: e.target.value })}
          className="px-2 py-2 border rounded text-sm"
        />
      </label>

      <div className="flex items-center gap-1 ml-1">
        <button
          type="button"
          onClick={() =>
            onChange({ from: formatDate(today), to: formatDate(today) })
          }
          className="px-2 py-2 rounded bg-gray-100 hover:bg-gray-200 text-xs"
        >
          本日
        </button>
        <button
          type="button"
          onClick={() =>
            onClearAll ? onClearAll() : onChange({ from: "", to: "" })
          }
          className="px-2 py-2 rounded bg-gray-100 hover:bg-gray-200 text-xs"
        >
          クリア
        </button>
      </div>
    </div>
  );
}
