"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Modal from "@/components/ui/modals/Modal";
import CompanyModalForm from "@/components/ui/modals/CompanyModalForm";
import Table from "@/components/ui/table/Table";
import Pagination from "@/components/ui/table/Pagination";
import PageSizeSelect from "@/components/ui/table/PageSizeSelect";
import KeywordFilter from "@/components/ui/filters/KeywordFilter";
import CompanyCSVImport from "@/components/ui/modals/CompanyCSVImport";
import CompanyTableActions from "@/components/ui/table/CompanyTableActions";
import Button from "@/components/ui/Button";
import { Company } from "@/types/company.types";
import { useModal } from "@/hooks/useModal";
import { usePagination } from "@/hooks/usePagination";
import { useSort } from "@/hooks/useSort";
import { useCompanies } from "@/hooks/useCompanies";
import { formatDateTime } from "@/utils/format/index";
import type { CompanyWithRecruiterCount } from "@/utils/sort/company";

const headers: { label: string; key: keyof CompanyWithRecruiterCount }[] = [
  { label: "企業名", key: "name" },
  { label: "担当者数", key: "recruiter_count" },
  { label: "作成日", key: "created_at" },
  { label: "更新日", key: "updated_at" },
];

export default function CompaniesPage() {
  const modal = useModal(); // モーダルの開閉状態を管理（企業作成・編集モーダル用）
  const pagination = usePagination(); // ページネーションの状態を管理（現在のページ、ページサイズ、総件数）

  // テーブルのソート状態を管理（ソートキーと昇順/降順）
  const sort = useSort<keyof CompanyWithRecruiterCount>({
    initialKey: "created_at", // 初期ソートは作成日
    initialAsc: false, // 降順（新しい順）
  });

  // 編集中の企業データ（編集モーダルで使用、nullの場合は新規作成）
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [keyword, setKeyword] = useState("");

  // 企業データ取得のカスタムフック
  // キーワード、ソート、ページネーション条件に基づいて企業一覧を取得
  const { companies, isLoading, error, fetchCompanies, setError } =
    useCompanies({
      keyword,
      pagination,
      sort,
    });

  // キーワード変更時は1ページ目へ: キーワード変更時にページをリセットして最初から表示
  useEffect(() => {
    pagination.resetPage();
  }, [keyword]);

  // モーダルを閉じる処理: モーダルを閉じて編集状態をクリアし、データを再取得
  const handleCloseModal = useCallback(() => {
    modal.close();
    setEditingCompany(null);
    fetchCompanies();
  }, [modal, fetchCompanies]);

  // 新規作成モーダルを開く処理: 編集状態をクリアしてからモーダルを開く
  const handleOpenCreateModal = useCallback(() => {
    setEditingCompany(null);
    modal.open();
  }, [modal]);

  // 編集モーダルを開く処理: 選択した企業を編集状態に設定してモーダルを開く
  const handleEditClick = useCallback(
    (company: Company) => {
      setEditingCompany(company);
      modal.open();
    },
    [modal]
  );

  // ソート処理: テーブルの列をクリックしたときにソートを実行し、1ページ目に戻る
  const handleSort = useCallback(
    (key: keyof CompanyWithRecruiterCount) => {
      sort.handleSort(key);
      pagination.resetPage(); // ソート変更時は1ページ目から表示
    },
    [sort, pagination]
  );

  // キーワード変更処理: キーワードを更新し、エラーをクリア
  const handleKeywordChange = useCallback(
    (value: string) => {
      setKeyword(value);
      setError(null);
    },
    [setError]
  );

  // 表示用データの準備（日付をフォーマット）
  const displayData = useMemo(
    () =>
      companies.map((company) => ({
        ...company,
        created_at: formatDateTime(company.created_at),
        updated_at: formatDateTime(company.updated_at),
      })),
    [companies]
  );

  return (
    <div>
      {/* 企業作成・編集モーダル: editingCompanyがnullなら新規作成、値があれば編集 */}
      <Modal isOpen={modal.isOpen} onClose={handleCloseModal}>
        <CompanyModalForm
          onClose={handleCloseModal}
          initialData={editingCompany || undefined}
        />
      </Modal>

      <h2 className="text-xl font-semibold mb-4">企業管理</h2>

      {/* エラー表示: データ取得時にエラーが発生した場合に表示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* アクションボタンエリア: CSVインポートと新規作成ボタン */}
      <div className="my-5 flex justify-end gap-2 font-semibold">
        <CompanyCSVImport />
        <Button variant="primary" size="lg" onClick={handleOpenCreateModal}>
          ＋企業追加
        </Button>
      </div>

      {/* 検索フィルター: 企業名で企業を絞り込み */}
      <div className="mb-3 flex items-end gap-3">
        <KeywordFilter
          value={keyword}
          onChange={handleKeywordChange}
          placeholder="企業名"
          label="企業名検索"
        />
        {keyword && (
          <Button
            type="button"
            onClick={() => handleKeywordChange("")}
            variant="light"
            size="sm"
          >
            クリア
          </Button>
        )}
      </div>

      {/* 企業一覧テーブル: フィルター・ソート・ページネーション適用済みのデータを表示 */}
      <Table
        headers={headers}
        data={displayData}
        isLoading={isLoading}
        sortKey={sort.sortKey}
        sortAsc={sort.sortAsc}
        onSort={handleSort}
        renderActions={(row) => {
          const company = companies.find(
            (c) => c.id === (row as { id: string }).id
          ) as Company;
          return (
            <CompanyTableActions company={company} onEdit={handleEditClick} />
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
          totalCount={pagination.totalCount}
          onPrev={pagination.goToPrevPage}
          onNext={pagination.goToNextPage}
        />
      </div>
    </div>
  );
}
