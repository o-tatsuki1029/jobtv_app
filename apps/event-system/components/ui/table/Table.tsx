"use client";

type TableHeader<T> = {
  label: string | React.ReactNode;
  key: keyof T;
  renderCell?: (value: unknown, row: T) => React.ReactNode;
  colSpan?: number;
};

type TableProps<T> = {
  headers: TableHeader<T>[];
  data: T[];
  renderActions?: (row: T) => React.ReactNode;
  sortKey?: keyof T;
  sortAsc?: boolean;
  onSort?: (key: keyof T) => void;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  getRowKey?: (row: T, index: number) => string | number;
  getRowClassName?: (row: T) => string;
  variant?: "default" | "ipad";
};

type TableStyles = {
  headerCellClass: string;
  cellClass: string;
  rowHeightClass: string;
  sortButtonMinHeight: string;
};

// スタイルの条件分岐
function getTableStyles(variant: "default" | "ipad" = "default"): TableStyles {
  const isIpad = variant === "ipad";

  return {
    headerCellClass: isIpad
      ? "px-4 py-3 text-left text-sm font-semibold bg-gray-50 border-b-2 border-gray-300"
      : "px-3 py-2 text-left text-xs font-semibold bg-gray-50 border-b border-gray-200",
    cellClass: isIpad
      ? "px-4 py-3 border-b border-gray-200 text-sm align-middle"
      : "px-3 py-2 border-b border-gray-200 text-xs align-middle",
    rowHeightClass: isIpad ? "h-14" : "",
    sortButtonMinHeight: isIpad ? "min-h-[36px]" : "",
  };
}

// 行のクラス名を生成する関数
function getRowClassName<T>(
  customRowClassName: string,
  onRowClick: ((row: T) => void) | undefined,
  rowHeightClass: string
): string {
  const isSpecialRow = customRowClassName.includes("bg-red");

  const baseClasses = `transition-all border-b border-gray-200 ${rowHeightClass}`;

  if (isSpecialRow) {
    const hoverClasses = onRowClick
      ? "cursor-pointer hover:bg-red-200 active:bg-red-300 hover:shadow-sm"
      : "hover:bg-red-200";
    return `${baseClasses} ${hoverClasses} ${customRowClassName}`;
  }

  const hoverClasses = onRowClick
    ? "cursor-pointer hover:bg-blue-50 active:bg-blue-100 hover:shadow-sm"
    : "hover:bg-gray-50";

  return `${baseClasses} ${hoverClasses} ${customRowClassName}`;
}

// ソートアイコンコンポーネント
function SortIcon({ isAsc }: { isAsc: boolean }) {
  return (
    <svg
      className="w-4 h-4 text-blue-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d={isAsc ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"}
      />
    </svg>
  );
}

// テーブルヘッダーコンポーネント
function TableHeader<T extends object>({
  headers,
  styles,
  sortKey,
  sortAsc,
  onSort,
  onRowClick,
  renderActions,
}: {
  headers: TableHeader<T>[];
  styles: TableStyles;
  sortKey?: keyof T;
  sortAsc?: boolean;
  onSort?: (key: keyof T) => void;
  onRowClick?: (row: T) => void;
  renderActions?: (row: T) => React.ReactNode;
}) {
  return (
    <thead>
      <tr className="bg-gray-50">
        {headers.map((header) => {
          const isActive = sortKey && sortKey === header.key;
          return (
            <th
              key={String(header.key)}
              className={styles.headerCellClass}
              colSpan={header.colSpan || 1}
            >
              {onSort ? (
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 hover:underline touch-manipulation ${
                    styles.sortButtonMinHeight
                  } ${isActive ? "text-blue-600" : ""}`}
                  onClick={() => onSort(header.key)}
                >
                  <span>{header.label}</span>
                  {isActive && sortAsc !== undefined && (
                    <SortIcon isAsc={sortAsc} />
                  )}
                </button>
              ) : (
                header.label
              )}
            </th>
          );
        })}
        {onRowClick && (
          <th className={`${styles.headerCellClass} text-right w-12`}></th>
        )}
        {renderActions && (
          <th className={`${styles.headerCellClass} text-right`}></th>
        )}
      </tr>
    </thead>
  );
}

// テーブルボディコンポーネント
function TableBody<T extends object>({
  headers,
  data,
  styles,
  onRowClick,
  renderActions,
  getRowKey,
  getCustomRowClassName,
}: {
  headers: TableHeader<T>[];
  data: T[];
  styles: TableStyles;
  onRowClick?: (row: T) => void;
  renderActions?: (row: T) => React.ReactNode;
  getRowKey?: (row: T, index: number) => string | number;
  getCustomRowClassName?: (row: T) => string;
}) {
  return (
    <tbody>
      {data.map((row, idx) => {
        const rowKey = getRowKey
          ? getRowKey(row, idx)
          : (row as { id?: string | number }).id ?? idx;
        const customRowClassName = getCustomRowClassName
          ? getCustomRowClassName(row)
          : "";
        return (
          <tr
            key={rowKey}
            className={getRowClassName(
              customRowClassName,
              onRowClick,
              styles.rowHeightClass
            )}
            onClick={() => onRowClick?.(row)}
          >
            {headers.map((header) => (
              <td
                key={String(header.key)}
                className={styles.cellClass}
                colSpan={header.colSpan || 1}
              >
                {header.renderCell
                  ? header.renderCell(row[header.key], row)
                  : String(row[header.key])}
              </td>
            ))}
            {onRowClick && (
              <td className={`${styles.cellClass} text-right w-12`}>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </td>
            )}
            {renderActions && (
              <td
                className={`${styles.cellClass} text-right`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-end">{renderActions(row)}</div>
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
}

// ローディングバーコンポーネント
function LoadingBar() {
  return (
    <div className="relative h-1 bg-gray-100 overflow-hidden">
      <div className="absolute inset-0 bg-blue-500 animate-loading-bar" />
    </div>
  );
}

export default function Table<T extends object>({
  headers,
  data,
  renderActions,
  sortKey,
  sortAsc,
  onSort,
  isLoading = false,
  onRowClick,
  getRowKey,
  getRowClassName: getCustomRowClassName,
  variant = "default",
}: TableProps<T>) {
  const styles = getTableStyles(variant);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
        <table className="min-w-full">
          <TableHeader
            headers={headers}
            styles={styles}
            sortKey={sortKey}
            sortAsc={sortAsc}
            onSort={onSort}
            onRowClick={onRowClick}
            renderActions={renderActions}
          />
          {!isLoading && (
            <TableBody
              headers={headers}
              data={data}
              styles={styles}
              onRowClick={onRowClick}
              renderActions={renderActions}
              getRowKey={getRowKey}
              getCustomRowClassName={getCustomRowClassName}
            />
          )}
        </table>
      </div>

      {isLoading && <LoadingBar />}
    </div>
  );
}
