"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useMatchingResults } from "@/hooks/useMatchingResults";
import { exportMatchingResultsToCSV } from "@/utils/data/matching-export";
import MatchingResultsTable from "@/components/ui/matching/MatchingResultsTable";
import { getMatchingResults } from "@/lib/actions/matching-actions";
import { MatchingResultData } from "@/types/matching.types";

type MatchingResultsClientProps = {
  results: MatchingResultData[];
  sessionId: string;
  allSessions: Array<{
    id: string;
    created_at: string;
    session_count: number;
    company_weight: number;
    candidate_weight: number;
  }>;
  eventId: string;
  eventDate: string;
  startTime: string;
  eventName: string;
};

export default function MatchingResultsClient({
  results: initialResults,
  sessionId: initialSessionId,
  allSessions,
  eventId,
  eventDate,
  startTime,
  eventName,
}: MatchingResultsClientProps) {
  const router = useRouter();
  const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId);
  const [results, setResults] = useState(initialResults);
  const [isLoading, setIsLoading] = useState(false);

  const { maxSessionNumber, sessionGroupedData } = useMatchingResults(results);

  // 初期セッションIDが変更された場合（ページ再読み込みなど）にリセット
  useEffect(() => {
    setSelectedSessionId(initialSessionId);
    setResults(initialResults);
  }, [initialSessionId, initialResults]);

  // セッション選択時の処理
  useEffect(() => {
    if (selectedSessionId !== initialSessionId) {
      setIsLoading(true);
      getMatchingResults(selectedSessionId).then((result) => {
        if (result.success) {
          setResults(result.results || []);
          // URLを更新（履歴に追加しない）
          window.history.replaceState(
            {},
            "",
            `/admin/matching/results/${selectedSessionId}`
          );
        }
        setIsLoading(false);
      });
    }
  }, [selectedSessionId, initialSessionId]);

  const handleExportCSV = () => {
    if (results.length > 0) {
      // 現在のセッションの実行回数を計算
      const sessionIndex = allSessions.findIndex(
        (s) => s.id === selectedSessionId
      );
      const executionNumber =
        sessionIndex !== -1 ? allSessions.length - sessionIndex : 0;

      exportMatchingResultsToCSV(
        sessionGroupedData,
        maxSessionNumber,
        selectedSessionId,
        eventDate,
        executionNumber,
        startTime,
        eventName
      );
    }
  };

  const handleBack = () => {
    router.push("/admin/matching");
  };

  // セッション選択肢のフォーマット
  const sessionOptions = allSessions.map((session, index) => {
    const date = new Date(session.created_at);
    const dateStr = date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    // 一番古いものが1回目になるように（allSessionsは新しい順でソートされているため、逆順にする）
    const executionNumber = allSessions.length - index;
    return {
      value: session.id,
      label: `${executionNumber}回目の実行 - ${dateStr}`,
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">マッチング結果</h2>
        <div className="flex gap-3">
          {results.length > 0 && (
            <>
              <Button
                variant="secondary"
                onClick={() =>
                  router.push(`/admin/matching/feedback/${eventId}`)
                }
              >
                フィードバック一覧
              </Button>
              <Button variant="secondary" onClick={handleExportCSV}>
                CSVエクスポート
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={handleBack}>
            戻る
          </Button>
        </div>
      </div>

      {/* セッション選択プルダウン */}
      {allSessions.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            表示するマッチング結果を選択
          </label>
          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            disabled={isLoading}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sessionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoading ? (
        <div className="p-6 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-medium">読み込み中...</span>
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
          マッチング結果がありません。マッチングを実行してください。
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: maxSessionNumber }, (_, i) => {
            const sessionNumber = i + 1;
            const sessionData = sessionGroupedData.get(sessionNumber) || [];

            // データを2つに分割
            const midPoint = Math.ceil(sessionData.length / 2);
            const firstHalf = sessionData.slice(0, midPoint);
            const secondHalf = sessionData.slice(midPoint);

            return (
              <div
                key={sessionNumber}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="text-lg font-semibold mb-4">
                  {sessionNumber}回目の座談会
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* 左側のテーブル */}
                  <div>
                    <MatchingResultsTable data={firstHalf} />
                  </div>

                  {/* 右側のテーブル */}
                  <div>
                    <MatchingResultsTable data={secondHalf} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
