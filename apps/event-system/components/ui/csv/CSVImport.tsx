"use client";

import { useState, useRef } from "react";
import Modal from "@/components/ui/modals/Modal";
import Button from "@/components/ui/Button";
import { supabaseInsert } from "@/lib/actions/supabase-actions";
import { downloadCSVAsShiftJIS } from "@/utils/data/csv";
import { useModal } from "@/hooks/useModal";
import { Database } from "@/types/database.types";

type CSVImportProps<T> = {
  tableName: string;
  inputId: string;
  transformRow: (row: string[]) => T | Promise<T>;
  validateData: (data: T) => boolean;
  formatHeaders: string[];
  formatRows: (string | number)[][];
  formatFilename: string;
  onSuccess?: () => void;
};

export default function CSVImport<T>({
  tableName,
  inputId,
  transformRow,
  validateData,
  formatHeaders,
  formatRows,
  formatFilename,
  onSuccess,
}: CSVImportProps<T>) {
  const modal = useModal();
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    items: T[];
    headers: string[];
    rows: string[][];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadFormat = async () => {
    try {
      await downloadCSVAsShiftJIS(formatHeaders, formatRows, formatFilename);
      modal.close();
    } catch {
      alert("フォーマットのダウンロードに失敗しました");
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

      // データを変換（非同期対応）
      setStatus("データを変換中...");
      const transformedRows: T[] = [];
      const errors: string[] = [];
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.some((cell: string) => cell.trim())) continue; // 空行をスキップ
        
        try {
          const transformed = await transformRow(row);
          if (validateData(transformed)) {
            transformedRows.push(transformed);
          } else {
            errors.push(`${i + 1}行目: データの検証に失敗しました`);
          }
        } catch (error) {
          errors.push(
            `${i + 1}行目: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }
      
      if (errors.length > 0 && transformedRows.length === 0) {
        throw new Error(`すべての行でエラーが発生しました:\n${errors.join("\n")}`);
      }
      
      if (errors.length > 0) {
        setStatus(`警告: ${errors.length}件のエラーがありますが、${transformedRows.length}件のデータを処理します`);
      }
      
      const items: T[] = transformedRows;

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
      // 一括登録
      let successCount = 0;
      let errorCount = 0;

      for (const item of confirmData.items) {
        const { error } = await supabaseInsert(
          tableName as keyof Database["public"]["Tables"],
          item as Record<string, unknown>
        );
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

      // 成功した場合はページをリロードまたはコールバック実行
      if (successCount > 0) {
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
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
    modal.close();
    setConfirmData(null);
    setStatus(null);
    setIsDragOver(false);
  };

  return (
    <>
      <Button variant="success" size="lg" onClick={modal.open}>
        CSVでデータ追加
      </Button>

      <Modal isOpen={modal.isOpen} onClose={handleCloseModal}>
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4">CSVでデータ追加</h2>

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
                  id={inputId}
                />
                <div className="pointer-events-none">
                  {isImporting ? (
                    <span className="text-gray-600">読み込み中...</span>
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
                  追加されるデータ ({confirmData.items.length}件)
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
                      </tr>
                    </thead>
                    <tbody>
                      {confirmData.rows.slice(0, 10).map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className="border border-gray-300 px-2 py-1"
                            >
                              {cell || ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {confirmData.rows.length > 10 && (
                    <p className="text-xs text-gray-500 mt-2">
                      ...他 {confirmData.rows.length - 10} 件
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  disabled={isImporting}
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
    </>
  );
}
