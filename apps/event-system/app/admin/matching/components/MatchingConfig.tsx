import React from "react";
import Button from "@/components/ui/Button";

interface MatchingConfigProps {
  sessionCount: number;
  setSessionCount: (count: number) => void;
  companyCount: number;
  isExecuting: boolean;
  onExecute: () => void;
  onSpecialInterviewOpen: () => void;
  selectedEventId: string;
  matchingSessionId?: string | null;
  onShowResults?: () => void;
  onShowFeedback?: () => void;
}

export const MatchingConfig: React.FC<MatchingConfigProps> = ({
  sessionCount,
  setSessionCount,
  companyCount,
  isExecuting,
  onExecute,
  onSpecialInterviewOpen,
  selectedEventId,
  matchingSessionId,
  onShowResults,
  onShowFeedback,
}) => {
  const maxValue = companyCount || 10;

  return (
    <div className="block">
      <div className="mb-2 text-sm font-medium text-gray-700">座談会回数</div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => sessionCount > 1 && setSessionCount(sessionCount - 1)}
          disabled={companyCount === 0 || sessionCount <= 1}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-lg font-semibold flex-shrink-0"
        >
          −
        </button>
        <input
          type="number"
          min="1"
          max={maxValue}
          value={sessionCount}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 1 && value <= maxValue) {
              setSessionCount(value);
            }
          }}
          className="w-20 px-3 py-2 border rounded text-center"
          disabled={companyCount === 0}
        />
        <button
          type="button"
          onClick={() =>
            sessionCount < maxValue && setSessionCount(sessionCount + 1)
          }
          disabled={companyCount === 0 || sessionCount >= maxValue}
          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-lg font-semibold flex-shrink-0"
        >
          ＋
        </button>
        <Button
          variant="danger"
          onClick={onSpecialInterviewOpen}
          disabled={isExecuting}
          size="sm"
        >
          特別面談登録
        </Button>
        <Button
          variant="primary"
          onClick={onExecute}
          disabled={isExecuting || !selectedEventId}
          size="sm"
        >
          {isExecuting ? "マッチング実行中..." : "マッチング実施"}
        </Button>
        {matchingSessionId && onShowResults && (
          <Button variant="secondary" onClick={onShowResults} size="sm">
            結果を表示
          </Button>
        )}
        {selectedEventId && onShowFeedback && (
          <Button variant="secondary" onClick={onShowFeedback} size="sm">
            フィードバック一覧
          </Button>
        )}
      </div>
      {companyCount > 0 && (
        <p className="mt-1 text-sm text-gray-500">
          登録企業数: {companyCount}社（上限: {companyCount}回）
        </p>
      )}
    </div>
  );
};
