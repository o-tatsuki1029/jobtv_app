import { decode } from "iconv-lite";

export async function parseCSV(file: File) {
  // ファイルをArrayBufferとして読み込む
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // SHIFT-JISとしてデコードを試行
  let csvText: string;
  try {
    csvText = decode(buffer, "shift_jis");
  } catch {
    // SHIFT-JISで失敗した場合はUTF-8として試行
    csvText = buffer.toString("utf-8");
  }

  // CSVをパース
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) {
    throw new Error("CSVファイルが空です");
  }

  // ヘッダー行を取得
  const headers = parseCSVLine(lines[0]);
  
  // データ行をパース
  const rows = lines.slice(1).map((line) => parseCSVLine(line));

  return { headers, rows };
}

// CSVの1行をパース（カンマ区切り、ダブルクォート対応）
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // エスケープされたダブルクォート
        current += '"';
        i++; // 次の文字をスキップ
      } else {
        // クォートの開始/終了
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // フィールドの区切り
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current); // 最後のフィールド
  return result;
}

