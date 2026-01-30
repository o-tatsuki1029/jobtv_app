import { MatchingResultRow } from "@/types/matching.types";
import { RATING_NUMBER_MAP } from "@/types/rating.types";

/**
 * マッチング結果をCSV形式でエクスポート
 */
export function exportMatchingResultsToCSV(
  sessionGroupedData: Map<number, MatchingResultRow[]>,
  maxSessionNumber: number,
  sessionId: string,
  eventDate?: string,
  executionNumber?: number,
  startTime?: string,
  eventName?: string
) {
  const csvRows: string[] = [];

  // ヘッダー
  csvRows.push(
    "座談会回数,席番号,学生名,特別面談,企業名,ロジカル,アクティブ,クリエイティブ,コミュニケーション,サポート,総合評価,コメント"
  );

  const getGrade = (rating: number | null | undefined) => {
    if (rating === null || rating === undefined) return "";
    return RATING_NUMBER_MAP[rating] || "";
  };

  for (let sessionNum = 1; sessionNum <= maxSessionNumber; sessionNum++) {
    const sessionData = sessionGroupedData.get(sessionNum) || [];
    sessionData.forEach((row) => {
      csvRows.push(
        [
          sessionNum,
          row.seatNumber,
          `"${row.candidateName}"`,
          row.isSpecialInterview ? "【特】" : "",
          `"${row.companyName}"`,
          getGrade(row.logicRating),
          getGrade(row.initiativeRating),
          getGrade(row.creativeRating),
          getGrade(row.communicationRating),
          getGrade(row.cooperationRating),
          getGrade(row.overallRating),
          `"${(row.comment || "").replace(/"/g, '""')}"`,
        ].join(",")
      );
    });
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;

  // ファイル名の生成: yyyymmdd_hhMM_イベント名_n回目マッチング結果.csv
  let filename = `matching_results_${sessionId}.csv`;
  if (eventDate && executionNumber) {
    const dateStr = eventDate.replace(/-/g, ""); // YYYYMMDD
    const timeStr = (startTime || "00:00").replace(/:/g, "").substring(0, 4); // hhMM
    const nameStr = eventName || "イベント";

    filename = `${dateStr}_${timeStr}_${nameStr}_${executionNumber}回目マッチング結果.csv`;
  }

  link.download = filename;
  link.click();

  // メモリリークを防ぐためにURLを解放
  URL.revokeObjectURL(url);
}
