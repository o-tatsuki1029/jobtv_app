"use client";

import { useState } from "react";
import { useEventForm } from "@/hooks/useEventForm";
import { Event } from "@/types/event.types";
import { useMasterData } from "@/hooks/useMasterData";
import { deleteEvent } from "@/lib/actions/events-actions";
import {
  FormField,
  TextInput,
  SelectInput,
  DateInput,
  TimeInput,
} from "@/components/ui/form/FormField";
import Button from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";

type EventModalFormProps = {
  onClose: () => void; // モーダルを閉じる関数（page.tsxから渡される）
  initialData?: Event;
  onSuccess?: () => void; // 成功時のコールバック（データ再取得など）
};

export default function EventModalForm({
  onClose,
  initialData,
  onSuccess,
}: EventModalFormProps) {
  // マスタデータを取得
  const { areas, graduationYears, eventTypes, isLoading: isMasterLoading } = useMasterData();
  
  // 削除確認モーダルの状態
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // モーダルを閉じる処理: 成功時のコールバックを実行してから閉じる
  const handleClose = () => {
    onSuccess?.(); // データ再取得などの処理を実行
    onClose(); // モーダルを閉じる
  };

  const { form, status, isSubmitting, isEditMode, handleChange, handleSubmit } =
    useEventForm({
      initialData,
      onSuccess: handleClose, // 成功時にモーダルを閉じる処理を実行
    });

  // 選択されたイベントタイプから卒年度とエリアを取得（表示用）
  const selectedEventType = eventTypes.find(
    (t) => t.id === (form.event_type_id || "")
  );
  const displayGraduationYear = selectedEventType?.target_graduation_year;
  const displayArea = selectedEventType?.area;

  // 削除処理
  const handleDelete = async () => {
    if (!initialData?.id) return;

    setIsDeleting(true);
    try {
      const { error } = await deleteEvent(initialData.id);
      if (error) {
        console.error("イベント削除エラー:", error);
        alert("イベントの削除に失敗しました");
      } else {
        handleClose(); // 成功時にモーダルを閉じてデータを再取得
      }
    } catch (error) {
      console.error("イベント削除エラー:", error);
      alert("イベントの削除に失敗しました");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // 有効なものだけを選択肢として表示
  const graduationYearOptions = graduationYears
    .filter((year) => year.is_active)
    .map((year) => ({
      value: String(year.year),
      label: String(year.year),
  }));

  const areaOptions = areas
    .filter((area) => area.is_active)
    .map((area) => ({
      value: area.name,
      label: area.name,
    }));

  const eventTypeOptions = eventTypes
    .filter((type) => type.is_active)
    .map((type) => ({
      value: type.id,
      label: type.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="w-full pb-6">
      <h2 className="text-xl font-bold mb-6">
        {isEditMode ? "イベント編集" : "イベント新規作成"}
      </h2>

      <FormField label="イベント名">
        <SelectInput
          name="event_type_id"
          value={form.event_type_id ? String(form.event_type_id) : ""}
          onChange={handleChange}
          options={eventTypeOptions}
          placeholder={isMasterLoading ? "読み込み中..." : "イベント名を選択"}
          disabled={isMasterLoading}
          required
        />
      </FormField>

      <FormField label="対象卒年度">
        <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700">
          {displayGraduationYear
            ? String(displayGraduationYear)
            : "イベントタイプを選択してください"}
        </div>
      </FormField>

      <FormField label="エリア">
        <div className="px-3 py-2 border border-gray-300 rounded bg-gray-50 text-gray-700">
          {displayArea || "イベントタイプを選択してください"}
        </div>
      </FormField>

      <FormField label="開催日">
        <DateInput
          name="event_date"
          value={form.event_date}
          onChange={handleChange}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <FormField label="開始時刻" className="w-full">
          <TimeInput
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
          />
        </FormField>

        <FormField label="終了時刻" className="w-full">
          <TimeInput
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
          />
        </FormField>
      </div>

      <div className="flex gap-2">
        {isEditMode && (
          <Button
            type="button"
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isSubmitting || isDeleting}
            className="flex-1"
          >
            削除
          </Button>
        )}
      <button
        type="submit"
          disabled={isSubmitting || isDeleting}
          className="bg-blue-500 text-white px-10 py-2 rounded hover:bg-blue-600 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "送信中..." : isEditMode ? "更新" : "登録"}
      </button>
      </div>

      {status && <p className="mt-2">{status}</p>}

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        message={`イベント「${eventTypes.find((t) => t.id === initialData?.event_type_id)?.name || ""}」を削除しますか？この操作は取り消せません。`}
        reservation={null}
        onConfirm={handleDelete}
      />
    </form>
  );
}
