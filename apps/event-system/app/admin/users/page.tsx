"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Table from "@/components/ui/table/Table";
import Pagination from "@/components/ui/table/Pagination";
import PageSizeSelect from "@/components/ui/table/PageSizeSelect";
import KeywordFilter from "@/components/ui/filters/KeywordFilter";
import Button from "@/components/ui/Button";
import { usePagination } from "@/hooks/usePagination";
import { useSort } from "@/hooks/useSort";
import { useModal } from "@/hooks/useModal";
import { useUsers } from "@/hooks/useUsers";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { formatDateTime } from "@/utils/format/index";
import { resetUserPassword, deleteUser } from "@/lib/actions/admin-users-actions";
import type { User } from "@jobtv-app/shared/types";
import { ROLE_LABELS } from "@/types";
import AdminUserCreateModal from "../../../components/ui/modals/AdminUserCreateModal";
import PasswordDisplayModal from "../../../components/ui/modals/PasswordDisplayModal";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";

// テーブルのヘッダー定義（表示項目とソートキーの対応）
const headers: { label: string; key: keyof User }[] = [
  { label: "メールアドレス", key: "email" },
  { label: "ロール", key: "role" },
  { label: "更新日", key: "updated_at" },
];

export default function AdminUsersPage() {
  const pagination = usePagination(); // ページネーションの状態を管理（現在のページ、ページサイズ、総件数）
  const sort = useSort<keyof User>({
    initialKey: "updated_at", // 初期ソートは更新日
    initialAsc: false, // 降順（新しい順）
  });
  const createModal = useModal(); // 管理者アカウント作成モーダルの開閉状態
  const passwordModal = useModal(); // パスワード表示モーダルの開閉状態
  const confirmModal = useConfirmModal(); // 確認モーダルの管理

  // 検索キーワード
  const [keyword, setKeyword] = useState("");
  // リセットされたパスワード（表示用）
  const [resetPassword, setResetPassword] = useState<string | null>(null);
  // パスワードリセット処理中の状態
  const [isResetting, setIsResetting] = useState(false);
  // フォーム操作時のエラーメッセージ
  const [formError, setFormError] = useState<string | null>(null);

  // ユーザーデータ取得のカスタムフック
  // キーワード、ソート、ページネーション条件に基づいてユーザー一覧を取得
  const { users, isLoading, error, fetchUsers, setError } = useUsers({
    keyword,
    pagination,
    sort,
  });

  // キーワード変更時は1ページ目へ: キーワード変更時にページをリセットして最初から表示
  useEffect(() => {
    pagination.resetPage();
  }, [keyword]);

  // ソート処理: テーブルの列をクリックしたときにソートを実行し、1ページ目に戻る
  const handleSort = useCallback(
    (key: keyof User) => {
      sort.handleSort(key);
      pagination.resetPage(); // ソート変更時は1ページ目から表示
    },
    [sort, pagination]
  );

  // 新規作成モーダルを開く処理
  const handleOpenCreateModal = useCallback(() => {
    setFormError(null);
    createModal.open();
  }, [createModal]);

  // 管理者アカウント作成成功時の処理
  const handleCreateSuccess = useCallback(
    (password?: string) => {
      fetchUsers();
      if (password) {
        setResetPassword(password);
        passwordModal.open();
      }
    },
    [fetchUsers, passwordModal]
  );

  // パスワードリセット処理
  const handleResetPassword = useCallback(
    (userId: string) => {
      confirmModal.showConfirm("パスワードをリセットしますか？", async () => {
        setIsResetting(true);
        setFormError(null);

        const result = await resetUserPassword(userId);

        if (result.success && result.password) {
          setResetPassword(result.password);
          passwordModal.open();
        } else {
          setFormError(result.error || "パスワードリセットに失敗しました");
        }

        setIsResetting(false);
      });
    },
    [confirmModal, passwordModal]
  );

  // ユーザー削除処理
  const handleDelete = useCallback(
    (userId: string, userEmail: string) => {
      confirmModal.showConfirm(
        `ユーザー「${userEmail}」を削除しますか？この操作は取り消せません。`,
        async () => {
          const result = await deleteUser(userId);

          if (result.success) {
            fetchUsers();
          } else {
            setError(result.error || "ユーザー削除に失敗しました");
          }
        }
      );
    },
    [confirmModal, fetchUsers, setError]
  );

  // キーワード変更処理: キーワードを更新し、エラーをクリア
  const handleKeywordChange = useCallback(
    (value: string) => {
      setKeyword(value);
      setError(null);
      setFormError(null);
    },
    [setError]
  );

  // パスワードモーダルを閉じる処理
  const handleClosePasswordModal = useCallback(() => {
    passwordModal.close();
    setResetPassword(null);
  }, [passwordModal]);

  // 表示用データの準備（日付をフォーマット、ロールを日本語化）
  const displayData = useMemo(
    () =>
      users.map((user) => ({
        ...user,
        role: user.role ? (ROLE_LABELS[user.role] || user.role) : "",
        updated_at: formatDateTime(user.updated_at || ""),
      })),
    [users]
  );

  return (
    <div>
      {/* 管理者アカウント作成モーダル */}
      <AdminUserCreateModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onSuccess={handleCreateSuccess}
        onError={setFormError}
      />

      {/* パスワード表示モーダル */}
      <PasswordDisplayModal
        isOpen={passwordModal.isOpen}
        password={resetPassword}
        onClose={handleClosePasswordModal}
      />

      {/* 確認モーダル */}
      <ConfirmModal
        isOpen={confirmModal.modal.isOpen}
        onClose={confirmModal.modal.close}
        message={confirmModal.confirmMessage}
        reservation={null}
        onConfirm={confirmModal.handleConfirm}
      />

      <h2 className="text-xl font-semibold mb-4">管理者アカウント管理</h2>

      {/* エラー表示: データ取得時にエラーが発生した場合に表示 */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* フォームエラー表示: フォーム操作時にエラーが発生した場合に表示 */}
      {formError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {formError}
        </div>
      )}

      {/* アクションボタンエリア: 新規作成ボタン */}
      <div className="my-5 flex justify-end">
        <Button variant="primary" size="lg" onClick={handleOpenCreateModal}>
          ＋管理者アカウント追加
        </Button>
      </div>

      {/* 検索フィルター: メールアドレスでユーザーを絞り込み */}
      <div className="mb-3 flex items-end gap-3">
        <KeywordFilter
          value={keyword}
          onChange={handleKeywordChange}
          placeholder="メールアドレスで検索"
          label="検索"
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

      {/* ユーザー一覧テーブル: フィルター・ソート・ページネーション適用済みのデータを表示 */}
      <Table
        headers={headers}
        data={displayData}
        isLoading={isLoading}
        sortKey={sort.sortKey}
        sortAsc={sort.sortAsc}
        onSort={handleSort}
        renderActions={(row) => {
          const user = users.find((u) => u.id === (row as { id: string }).id);
          if (!user) return null;
          return (
            <div className="flex gap-2">
              {/* パスワードリセットボタン: ユーザーのパスワードをリセット */}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleResetPassword(user.id)}
                disabled={isResetting}
              >
                {isResetting ? "リセット中..." : "パスワードリセット"}
              </Button>
              {/* 削除ボタン: ユーザーを削除 */}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(user.id, user.email || "")}
              >
                削除
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
          totalCount={pagination.totalCount}
          onPrev={pagination.goToPrevPage}
          onNext={pagination.goToNextPage}
        />
      </div>
    </div>
  );
}
