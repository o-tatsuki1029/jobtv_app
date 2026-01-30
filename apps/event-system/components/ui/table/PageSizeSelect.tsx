type PageSizeSelectProps = {
  pageSize: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
};

export default function PageSizeSelect({
  pageSize,
  onChange,
  options = [5, 10, 20, 50, 100],
  className,
}: PageSizeSelectProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-sm text-gray-600">表示件数</span>
      <select
        className="px-2 py-2 border rounded text-sm"
        value={pageSize}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
