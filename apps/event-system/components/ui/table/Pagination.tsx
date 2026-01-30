type PaginationProps = {
  page: number;
  pageSize: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
};

export default function Pagination({
  page,
  pageSize,
  totalCount,
  onPrev,
  onNext,
  className,
}: PaginationProps) {
  // pageは0ベース（0 = 1ページ目、1 = 2ページ目）
  const start = totalCount === 0 ? 0 : page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalCount);
  const canPrev = page > 0;
  const canNext = (page + 1) * pageSize < totalCount;

  return (
    <div className={`flex items-center justify-end gap-3 ${className ?? ""}`}>
      <div className="text-sm text-gray-600">
        {totalCount === 0 ? "0件" : `${start} - ${end} / ${totalCount}`}
      </div>
      <button
        className="px-3 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onPrev}
        disabled={!canPrev}
      >
        ← 前へ
      </button>
      <button
        className="px-3 py-2 rounded bg-gray-200 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={!canNext}
      >
        次へ →
      </button>
    </div>
  );
}
