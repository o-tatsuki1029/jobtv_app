"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/modals/Modal";
import EventModalForm from "@/components/ui/modals/EventModalForm";
import Table from "@/components/ui/table/Table";
import Pagination from "@/components/ui/table/Pagination";
import PageSizeSelect from "@/components/ui/table/PageSizeSelect";
import EventFilters, { EventFilter } from "@/components/ui/table/EventFilters";
import EventCSVImport from "@/components/ui/modals/EventCSVImport";
import EventCSVExport from "@/components/ui/csv/EventCSVExport";
import Button from "@/components/ui/Button";
import { Event } from "@/types/event.types";
import { useModal } from "@/hooks/useModal";
import { usePagination } from "@/hooks/usePagination";
import { useSort } from "@/hooks/useSort";
import { useEventData } from "@/hooks/useEventData";
import type { EventWithCounts } from "@/utils/sort/events";

// テーブルのヘッダー定義（表示項目とソートキーの対応）
const headers: { label: string; key: keyof EventWithCounts }[] = [
  { label: "対象卒年度", key: "target_graduation_year" },
  { label: "エリア", key: "area" },
  { label: "イベント名", key: "event_name" },
  { label: "イベント日", key: "event_date" },
  { label: "開始時刻", key: "start_time" },
  { label: "終了時刻", key: "end_time" },
  { label: "企業数", key: "company_count" },
  { label: "学生数", key: "reservation_count" },
  { label: "着座数", key: "attended_count" },
];

export default function EventManagementPage() {
  const router = useRouter(); // Next.jsのルーティング機能（ページ遷移に使用）
  const modal = useModal(); // モーダルの開閉状態を管理（イベント作成・編集モーダル用）
  const pagination = usePagination(); // ページネーションの状態を管理（現在のページ、ページサイズ、総件数）

  // テーブルのソート状態を管理（ソートキーと昇順/降順）
  const sort = useSort<keyof EventWithCounts>({
    initialKey: "event_date", // 初期ソートはイベント日
    initialAsc: true, // 昇順（古い順）
  });

  // 編集中のイベントデータ（編集モーダルで使用、nullの場合は新規作成）
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // フィルター条件（エリア、卒年度、日付範囲）
  const [filters, setFilters] = useState<EventFilter>({
    area: "",
    graduationYear: "",
    dateFrom: "",
    dateTo: "",
  });

  // イベントデータ取得のカスタムフック
  // フィルター、ソート、ページネーション条件に基づいてイベント一覧を取得
  const { events, isLoading, error, totalCount, fetchEvents } = useEventData({
    filters,
    sortKey: sort.sortKey as string,
    sortAsc: sort.sortAsc,
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  // データ取得: フィルター、ソート、ページが変更されたら再取得
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, pagination.page, pagination.pageSize]);

  // 総件数を設定: データ取得後にページネーションの総件数を更新
  useEffect(() => {
    pagination.setTotalCount(totalCount);
  }, [totalCount]); // paginationを依存配列から削除（無限ループを防ぐ）

  // フィルター変更時は1ページ目へ: フィルター変更時にページをリセットして最初から表示
  useEffect(() => {
    pagination.resetPage();
  }, [filters]); // paginationを依存配列から削除（page更新時に再実行されるのを防ぐ）

  // モーダルを閉じる処理: モーダルを閉じて編集状態をクリア
  // データ再取得はEventModalForm側で実行される
  const handleCloseModal = useCallback(() => {
    modal.close();
    setEditingEvent(null);
  }, [modal]);

  // モーダル成功時の処理: データを再取得して編集状態をクリア
  const handleModalSuccess = useCallback(() => {
    fetchEvents(); // データ更新を反映
    setEditingEvent(null);
  }, [fetchEvents]);

  // 新規作成モーダルを開く処理: 編集状態をクリアしてからモーダルを開く
  const handleOpenCreateModal = useCallback(() => {
    setEditingEvent(null);
    modal.open();
  }, [modal]);

  // 編集モーダルを開く処理: 選択したイベントを編集状態に設定してモーダルを開く
  const handleEditClick = useCallback(
    (event: Event) => {
      setEditingEvent(event);
      modal.open();
    },
    [modal]
  );

  // ソート処理: テーブルの列をクリックしたときにソートを実行し、1ページ目に戻る
  const handleSort = useCallback(
    (key: keyof EventWithCounts) => {
      sort.handleSort(key);
      pagination.resetPage(); // ソート変更時は1ページ目から表示
    },
    [sort, pagination]
  );

  // 企業登録ページへ遷移: 選択したイベントの企業登録管理ページへ移動
  const handleCompanyRegistration = useCallback(
    (event: Event) => {
      router.push(`/admin/event/company/${event.id}`);
    },
    [router]
  );

  // 予約/出席登録ページへ遷移: 選択したイベントの予約管理ページへ移動
  const handleReservation = useCallback(
    (event: Event) => {
      router.push(`/admin/event/reservation/${event.id}`);
    },
    [router]
  );

  return (
    <div>
      {/* イベント作成・編集モーダル: editingEventがnullなら新規作成、値があれば編集 */}
      {/* モーダルを閉じる処理はEventModalForm側で定義されている */}
      <Modal isOpen={modal.isOpen} onClose={handleCloseModal}>
        <EventModalForm
          onClose={handleCloseModal}
          initialData={editingEvent || undefined}
          onSuccess={handleModalSuccess}
        />
      </Modal>

      <h2 className="text-xl font-semibold mb-4">イベント管理</h2>

      {/* エラー表示: データ取得時にエラーが発生した場合に表示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* アクションボタンエリア: CSVエクスポート、CSVインポート、新規作成ボタン */}
      <div className="my-5 flex justify-end gap-2 font-semibold">
        <EventCSVExport
          filters={filters}
          sortKey={sort.sortKey as string}
          sortAsc={sort.sortAsc}
        />
        <EventCSVImport />
        <Button variant="primary" size="lg" onClick={handleOpenCreateModal}>
          ＋イベント追加
        </Button>
      </div>

      {/* フィルター: エリア、卒年度、日付範囲でイベントを絞り込み */}
      <EventFilters value={filters} onChange={setFilters} className="mb-3" />

      {/* イベント一覧テーブル: フィルター・ソート・ページネーション適用済みのデータを表示 */}
      <Table
        headers={headers}
        data={events}
        isLoading={isLoading}
        sortKey={sort.sortKey}
        sortAsc={sort.sortAsc}
        onSort={handleSort}
        getRowKey={(row) => row.id}
        renderActions={(row) => {
          const event = row as Event;
          return (
            <div className="flex gap-2 justify-end">
              {/* 企業登録ボタン: このイベントに参加する企業を管理するページへ遷移 */}
              <Button
                onClick={() => handleCompanyRegistration(event)}
                variant="danger"
                size="sm"
              >
                企業登録
              </Button>
              {/* 予約/出席登録ボタン: このイベントの学生予約・出席を管理するページへ遷移 */}
              <Button
                onClick={() => handleReservation(event)}
                variant="primary"
                size="sm"
              >
                予約/出席登録
              </Button>
              {/* 編集ボタン: このイベントの情報を編集するモーダルを開く */}
              <Button
                onClick={() => handleEditClick(event)}
                variant="light"
                size="sm"
              >
                編集
              </Button>
            </div>
          );
        }}
      />

      {/* ページネーションコントロール: ページサイズ選択とページ送り */}
      <div className="mt-4 flex items-center justify-end gap-4">
        <PageSizeSelect
          pageSize={pagination.pageSize}
          onChange={pagination.setPageSize}
        />
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalCount={totalCount}
          onPrev={pagination.goToPrevPage}
          onNext={pagination.goToNextPage}
        />
      </div>
    </div>
  );
}
