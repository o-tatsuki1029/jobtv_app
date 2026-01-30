// CSV出力用共通ユーティリティ（SHIFT-JIS対応）

// CSVの1行を作成（値をエスケープ）
export function escapeCSVValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // カンマ、ダブルクォート、改行が含まれる場合はダブルクォートで囲む
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// CSVデータをSHIFT-JISのBlobに変換してダウンロード
export async function downloadCSVAsShiftJIS(
  headers: string[],
  rows: (string | number | null | undefined)[][],
  filename: string
): Promise<void> {
  try {
    // CSV文字列を作成
    const csvLines = [
      headers.map(escapeCSVValue).join(","),
      ...rows.map((row) => row.map(escapeCSVValue).join(",")),
    ];
    const csvString = csvLines.join("\n");

    // API Routeを使用してSHIFT-JISに変換
    const response = await fetch("/api/convert-to-sjis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: csvString }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("SHIFT-JIS変換APIエラー:", errorText);
      throw new Error("SHIFT-JIS変換に失敗しました");
    }

    // ArrayBufferとして取得してからBlobに変換
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], {
      type: "text/csv;charset=shift_jis",
    });

    // ダウンロード
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("CSVダウンロードエラー:", error);
    throw error;
  }
}

