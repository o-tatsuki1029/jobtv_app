"use client";

import React, { useState, useRef } from "react";
import Modal from "./Modal";
import ModalHeader from "./ModalHeader";
import { supabaseInsert } from "@/lib/actions/supabase-actions";
import { downloadCSVAsShiftJIS } from "@/utils/data/csv";
import { createClient } from "@/lib/supabase/client";
import { EventReservationFormData } from "@/types/eventReservation.types";

type EventReservationImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ReservationRow = {
  eventName: string;
  candidateEmail: string;
  status: string;
  seatNumber?: string;
};

/**
 * イベント予約取り込みモーダル
 * CSVファイルからイベント予約データを取り込みます
 */
export default function EventReservationImportModal({
  isOpen,
  onClose,
}: EventReservationImportModalProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    items: Array<ReservationRow & { eventId?: string; candidateId?: string; error?: string }>;
    headers: string[];
    rows: string[][];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatHeaders = [
    "イベント名",
    "学生メールアドレス",
    "ステータス",
    "席番号",
  ];

  const formatRows = [
    [
      "2025年度新卒採用説明会",
      "yamada@example.com",
      "reserved",
      "A-1",
    ],
  ];

  const handleDownloadFormat = async () => {
    try {
      await downloadCSVAsShiftJIS(formatHeaders, formatRows, "event_reservations_format.csv");
    } catch {
      alert("フォーマットのダウンロードに失敗しました");
    }
  };

  // イベント名からイベントIDを取得
  const findEventId = async (eventName: string): Promise<string | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("events")
        .select("id")
        .eq("event_name", eventName.trim())
        .single();

      if (error || !data) {
        return null;
      }
      return data.id;
    } catch {
      return null;
    }
  };

  // メールアドレスから学生IDを取得
  const findCandidateId = async (email: string): Promise<string | null> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("candidates")
        .select("id")
        .eq("email", email.trim())
        .single();

      if (error || !data) {
        return null;
      }
      return data.id;
    } catch {
      return null;
    }
  };

  const processFile = async (file: File) => {
    setIsImporting(true);
    setStatus("ファイルを読み込み中...");

    if (!file.name.endsWith(".csv")) {
      setStatus("CSVファイルを選択してください");
      setIsImporting(false);
      return;
    }

    try {
      // CSVファイルをパース
      const formData = new FormData();
      formData.append("file", file);

      const parseResponse = await fetch("/api/parse-csv", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        const error = await parseResponse.json();
        throw new Error(error.error || "CSVパースに失敗しました");
      }

      const { headers, rows } = await parseResponse.json();

      // ヘッダー検証
      if (headers.length !== formatHeaders.length) {
        throw new Error(
          `ヘッダー数が一致しません。期待値: ${formatHeaders.length}個、実際: ${headers.length}個`
        );
      }

      const mismatchedHeaders: string[] = [];
      formatHeaders.forEach((expectedHeader, index) => {
        if (headers[index] !== expectedHeader) {
          mismatchedHeaders.push(
            `${index + 1}列目: 期待値「${expectedHeader}」、実際「${
              headers[index] || "(空)"
            }」`
          );
        }
      });

      if (mismatchedHeaders.length > 0) {
        throw new Error(
          `ヘッダーが一致しません:\n${mismatchedHeaders.join(
            "\n"
          )}\n\nサンプルCSVをダウンロードして正しいフォーマットを確認してください。`
        );
      }

      // データを変換してIDを取得
      setStatus("イベントと学生を検索中...");
      const items: Array<ReservationRow & { eventId?: string; candidateId?: string; error?: string }> = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.some((cell: string) => cell.trim())) continue; // 空行をスキップ

        const reservationRow: ReservationRow = {
          eventName: row[0]?.trim() || "",
          candidateEmail: row[1]?.trim() || "",
          status: row[2]?.trim() || "reserved",
          seatNumber: row[3]?.trim() || undefined,
        };

        // バリデーション
        if (!reservationRow.eventName) {
          items.push({ ...reservationRow, error: "イベント名が空です" });
          continue;
        }
        if (!reservationRow.candidateEmail) {
          items.push({ ...reservationRow, error: "メールアドレスが空です" });
          continue;
        }
        if (!reservationRow.status) {
          items.push({ ...reservationRow, error: "ステータスが空です" });
          continue;
        }

        // イベントIDを取得
        const eventId = await findEventId(reservationRow.eventName);
        if (!eventId) {
          items.push({ ...reservationRow, error: `イベント「${reservationRow.eventName}」が見つかりません` });
          continue;
        }

        // 学生IDを取得
        const candidateId = await findCandidateId(reservationRow.candidateEmail);
        if (!candidateId) {
          items.push({ ...reservationRow, error: `メールアドレス「${reservationRow.candidateEmail}」の学生が見つかりません` });
          continue;
        }

        items.push({ ...reservationRow, eventId, candidateId });
      }

      if (items.length === 0) {
        setStatus("追加するデータがありません");
        setIsImporting(false);
        return;
      }

      // 確認画面を表示
      setConfirmData({ items, headers, rows });
      setStatus(null);
      setIsImporting(false);
    } catch (error: unknown) {
      console.error("インポートエラー:", error);
      setStatus(
        "エラー: " + (error instanceof Error ? error.message : "ファイルの読み込みに失敗しました")
      );
      setIsImporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    // ファイル入力をリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleConfirm = async () => {
    if (!confirmData) return;

    setIsImporting(true);
    setStatus("追加中...");
    setConfirmData(null);

    try {
      // 有効なデータのみを抽出
      const validItems = confirmData.items.filter(
        (item) => item.eventId && item.candidateId && !item.error
      );

      if (validItems.length === 0) {
        setStatus("追加できるデータがありません");
        setIsImporting(false);
        return;
      }

      // 一括登録
      let successCount = 0;
      let errorCount = 0;

      for (const item of validItems) {
        if (!item.eventId || !item.candidateId) continue;

        const reservationData = {
          event_id: item.eventId,
          candidate_id: item.candidateId,
          status: item.status,
          seat_number: item.seatNumber || null,
          attended: false,
        } as EventReservationFormData & { candidate_id: string };

        const { error } = await supabaseInsert("event_reservations", reservationData);
        if (error) {
          console.error("登録エラー:", error);
          errorCount++;
        } else {
          successCount++;
        }
      }

      setStatus(
        `追加完了: ${successCount}件成功${
          errorCount > 0 ? `, ${errorCount}件失敗` : ""
        }`
      );

      // 成功した場合は少し待ってからモーダルを閉じる
      if (successCount > 0) {
        setTimeout(() => {
          onClose();
          setStatus(null);
          window.location.reload();
        }, 1500);
      }
    } catch (error: unknown) {
      console.error("インポートエラー:", error);
      const errorMessage =
        error instanceof Error ? error.message : "追加に失敗しました";
      setStatus("エラー: " + errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleCancel = () => {
    setConfirmData(null);
    setStatus(null);
  };

  const handleCloseModal = () => {
    onClose();
    setConfirmData(null);
    setStatus(null);
    setIsDragOver(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} maxWidth="4xl">
      <div className="w-full">
        <ModalHeader title="イベント予約取り込み">
          <p className="text-sm text-gray-600 mt-2">
            CSVファイルからイベント予約データを取り込みます
          </p>
        </ModalHeader>

        {!confirmData ? (
          <div className="space-y-3">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded p-8 text-center transition-colors ${
                isDragOver
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-500"
              } ${
                isImporting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={() => !isImporting && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isImporting}
                className="hidden"
                id="event-reservation-csv-input"
              />
              <div className="pointer-events-none">
                {isImporting ? (
                  <span className="text-gray-600">{status || "読み込み中..."}</span>
                ) : (
                  <>
                    <div className="text-gray-600 mb-2">
                      CSVファイルをドラッグ&ドロップ
                    </div>
                    <div className="text-sm text-gray-400">
                      またはクリックしてファイルを選択
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="text-center text-gray-500">または</div>

            <button
              onClick={handleDownloadFormat}
              className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
            >
              サンプルCSVのダウンロード
            </button>

            {status && (
              <p className="mt-4 text-sm text-center text-red-600 whitespace-pre-line">
                {status}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">
                追加されるデータ ({confirmData.items.filter((item) => !item.error).length}件)
              </h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      {confirmData.headers.map((header, idx) => (
                        <th
                          key={idx}
                          className="border border-gray-300 px-2 py-1 text-left"
                        >
                          {header}
                        </th>
                      ))}
                      <th className="border border-gray-300 px-2 py-1 text-left">
                        状態
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmData.items.slice(0, 10).map((item, rowIdx) => (
                      <tr key={rowIdx} className={item.error ? "bg-red-50" : ""}>
                        <td className="border border-gray-300 px-2 py-1">
                          {item.eventName}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {item.candidateEmail}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {item.status}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {item.seatNumber || "-"}
                        </td>
                        <td className="border border-gray-300 px-2 py-1">
                          {item.error ? (
                            <span className="text-red-600 text-xs">{item.error}</span>
                          ) : (
                            <span className="text-green-600 text-xs">✓ OK</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {confirmData.items.length > 10 && (
                  <p className="text-xs text-gray-500 mt-2">
                    ...他 {confirmData.items.length - 10} 件
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={isImporting || confirmData.items.every((item) => item.error)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? "追加中..." : "追加を実行"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isImporting}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                キャンセル
              </button>
            </div>

            {status && (
              <p className="text-sm text-center text-green-600">{status}</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

