"use client";

import { useState, useEffect, useMemo } from "react";
import type { FormattedReservation } from "@/utils/events/reservation";
import { parseSeatNumber } from "@/utils/events/reservation";

type SeatSelectionProps = {
  selectedLetter: string;
  selectedNum: string;
  onLetterChange: (letter: string) => void | Promise<void>;
  onNumChange: (num: string) => void;
  availableLetters: string[];
  availableNumbers: string[];
  disabled?: boolean;
  error?: string;
  onConfirm?: () => void;
  isUpdating?: boolean;
  studentName?: string;
  onStepChange?: (step: "letter" | "number" | "confirm") => void;
  onBack?: () => void;
  reservations?: FormattedReservation[];
  currentReservationId?: string;
};

export default function SeatSelection({
  selectedLetter,
  selectedNum,
  onLetterChange,
  onNumChange,
  availableLetters,
  availableNumbers,
  disabled = false,
  error,
  onConfirm,
  isUpdating = false,
  studentName,
  onStepChange,
  onBack,
  reservations = [],
  currentReservationId,
}: SeatSelectionProps) {
  const [currentStep, setCurrentStep] = useState<
    "letter" | "number" | "confirm"
  >("letter");

  // アルファベットが選択されたら数字選択画面に遷移
  useEffect(() => {
    if (selectedLetter && !selectedNum) {
      setCurrentStep("number");
    } else if (!selectedLetter) {
      setCurrentStep("letter");
    }
  }, [selectedLetter, selectedNum]);

  // ステップ変更を親に通知
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  // アルファベットを生成（A-Z）
  const allLetters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // 数字を生成（1-100）
  const allNumbers = Array.from({ length: 100 }, (_, i) => String(i + 1));

  // アルファベットごとの性別ごとの登録数を計算
  const letterGenderCounts = useMemo(() => {
    const counts: Record<string, { male: number; female: number; unknown: number }> = {};
    
    reservations
      .filter((r) => r.attended === "出席" && r.seat_number && r.id !== currentReservationId)
      .forEach((r) => {
        const parsed = parseSeatNumber(r.seat_number);
        if (!parsed) return;
        
        const letter = parsed.letter;
        if (!counts[letter]) {
          counts[letter] = { male: 0, female: 0, unknown: 0 };
        }
        
        if (r.gender === "男性") {
          counts[letter].male++;
        } else if (r.gender === "女性") {
          counts[letter].female++;
        } else {
          counts[letter].unknown++;
        }
      });
    
    return counts;
  }, [reservations, currentReservationId]);

  // 数字ごとの性別を取得
  const numberGenders = useMemo(() => {
    const genders: Record<string, string | null> = {};
    
    reservations
      .filter((r) => r.attended === "出席" && r.seat_number && r.id !== currentReservationId)
      .forEach((r) => {
        const parsed = parseSeatNumber(r.seat_number);
        if (!parsed) return;
        
        if (parsed.letter === selectedLetter) {
          genders[parsed.number] = r.gender;
        }
      });
    
    return genders;
  }, [reservations, selectedLetter, currentReservationId]);

  const handleLetterClick = async (letter: string) => {
    if (disabled) return;
    await onLetterChange(letter);
    setCurrentStep("number");
  };

  const handleNumClick = (num: string) => {
    if (disabled) return;
    onNumChange(num);
    // 数字を選択したら確認画面に遷移
    setCurrentStep("confirm");
  };

  const handleBackFromNumber = () => {
    if (disabled) return;
    onLetterChange("");
    onNumChange("");
    setCurrentStep("letter");
  };

  const handleBackFromConfirm = () => {
    if (disabled) return;
    setCurrentStep("number");
  };

  // 外部からの戻るボタンクリックを処理
  useEffect(() => {
    if (onBack) {
      const handleBack = () => {
        if (currentStep === "confirm") {
          handleBackFromConfirm();
        } else if (currentStep === "number") {
          handleBackFromNumber();
        }
      };
      // onBackが呼ばれたときに実行されるように、親コンポーネントで処理
    }
  }, [currentStep, onBack]);

  const handleConfirm = () => {
    if (disabled || !onConfirm) return;
    onConfirm();
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '350px' }}>
      {/* アルファベット選択画面 */}
      <div
        className={`transition-transform duration-300 ease-in-out absolute inset-0 flex flex-col ${
          currentStep === "letter"
            ? "translate-x-0 visible z-10"
            : "-translate-x-full pointer-events-none invisible z-0"
        }`}
      >
        <label className="block mb-3 font-semibold">アルファベットを選択</label>
        <div className="grid grid-cols-6 gap-2">
          {allLetters.map((letter) => {
            const isAvailable = availableLetters.includes(letter);
            const isSelected = selectedLetter === letter;
            const counts = letterGenderCounts[letter] || { male: 0, female: 0, unknown: 0 };
            const total = counts.male + counts.female + counts.unknown;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => handleLetterClick(letter)}
                disabled={disabled || !isAvailable}
                className={`
                  min-h-[50px] rounded font-semibold transition-all
                  touch-manipulation border flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? "bg-white text-blue-600 border-blue-600 ring-2 ring-blue-400 ring-offset-2"
                      : isAvailable
                      ? "bg-white text-blue-500 border-blue-500 hover:bg-blue-50 hover:border-blue-600"
                      : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed opacity-50"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <span className="text-lg">{letter}</span>
                {total > 0 && (
                  <span className="text-xs mt-0">
                    <span className="text-blue-400">男:{counts.male}</span>
                    {" "}
                    <span className="text-red-400">女:{counts.female}</span>
                    {counts.unknown > 0 && (
                      <>
                        {" "}
                        <span className="text-gray-400">他:{counts.unknown}</span>
                      </>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 数字選択画面 */}
      <div
        className={`transition-transform duration-300 ease-in-out absolute inset-0 flex flex-col ${
          currentStep === "number"
            ? "translate-x-0 visible z-10"
            : currentStep === "letter"
            ? "translate-x-full pointer-events-none invisible z-0"
            : "-translate-x-full pointer-events-none invisible z-0"
        }`}
      >
        <label className="block mb-3 font-semibold">
          数字を選択 {selectedLetter && `(${selectedLetter}席)`}
        </label>
        <div className="grid grid-cols-5 gap-2 max-h-[400px] overflow-y-auto">
          {allNumbers.map((num) => {
            const isAvailable = availableNumbers.includes(num);
            const isSelected = selectedNum === num;
            const gender = numberGenders[num];
            const isReserved = !isAvailable && gender !== undefined;
            
            // 登録済みの場合、性別に応じた色を設定
            let reservedBgColor = "";
            if (isReserved) {
              if (gender === "男性") {
                reservedBgColor = "bg-blue-100 text-blue-700 border-blue-300";
              } else if (gender === "女性") {
                reservedBgColor = "bg-red-100 text-red-700 border-red-300";
              } else {
                reservedBgColor = "bg-gray-200 text-gray-600 border-gray-400";
              }
            }
            
            return (
              <button
                key={num}
                type="button"
                onClick={() => handleNumClick(num)}
                disabled={disabled || !isAvailable}
                className={`
                  min-h-[50px] rounded font-semibold transition-all
                  touch-manipulation border
                  ${
                    isSelected
                      ? "bg-white text-blue-600 border-blue-600 ring-2 ring-blue-400 ring-offset-2"
                      : isReserved
                      ? reservedBgColor
                      : isAvailable
                      ? "bg-white text-blue-500 border-blue-500 hover:bg-blue-50 hover:border-blue-600"
                      : "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed opacity-50"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>

      {/* 確認画面 */}
      <div
        className={`transition-transform duration-300 ease-in-out absolute inset-0 ${
          currentStep === "confirm"
            ? "translate-x-0 visible z-10"
            : "translate-x-full pointer-events-none invisible z-0"
        }`}
      >
        <label className="block mb-4 font-semibold">確認</label>
        <div className="text-center py-4">
          {studentName && (
            <p className="text-xl font-semibold mb-2">{studentName}</p>
          )}
          <p className="text-lg mb-3">この出席番号で登録しますか？</p>
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {selectedLetter}
            {selectedNum}
          </div>
          {onConfirm && (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={disabled || isUpdating}
              className="w-full min-h-[60px] bg-red-700 hover:bg-red-800 text-white rounded font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {isUpdating ? "登録中..." : "出席登録"}
            </button>
          )}
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
