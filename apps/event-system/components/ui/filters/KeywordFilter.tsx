type Props = {
  value: string;
  onChange: (value: string) => void;
};

type KeywordFilterProps = Props & {
  placeholder?: string;
  label?: string;
};

export default function KeywordFilter({
  value,
  onChange,
  placeholder = "検索",
  label = "キーワード",
}: KeywordFilterProps) {
  return (
    <label className="block">
      <span className="block text-xs text-gray-600 mb-1">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-2 border rounded text-sm"
      />
    </label>
  );
}
