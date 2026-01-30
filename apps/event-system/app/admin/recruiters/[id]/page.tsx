"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Company } from "@/types/company.types";
import { createRecruiterUser, updateRecruiterProfile, deleteUser } from "@/lib/actions/admin-users-actions";
import Table from "@/components/ui/table/Table";
import Modal from "@/components/ui/modals/Modal";
import Button from "@/components/ui/Button";
import { useModal } from "@/hooks/useModal";
import { formatDateTime } from "@/utils/format/index";
import { validateKatakana } from "@/utils/validation/index";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";

type Recruiter = {
  id: string;
  company_id: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  email: string;
  created_at: string;
  updated_at: string;
};

const recruiterHeaders: {
  label: string;
  key: keyof Recruiter;
}[] = [
  { label: "姓", key: "last_name" },
  { label: "名", key: "first_name" },
  { label: "姓カナ", key: "last_name_kana" },
  { label: "名カナ", key: "first_name_kana" },
  { label: "メールアドレス", key: "email" },
  { label: "作成日", key: "created_at" },
];

export default function RecruiterPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  const modal = useModal();
  const deleteConfirmModal = useModal();

  const [company, setCompany] = useState<Company | null>(null);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<{
    last_name?: string;
    first_name?: string;
    last_name_kana?: string;
    first_name_kana?: string;
    email?: string;
  }>({});

  // フォーム状態
  const [editingRecruiter, setEditingRecruiter] = useState<Recruiter | null>(
    null
  );
  const [deletingRecruiter, setDeletingRecruiter] = useState<Recruiter | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    last_name_kana: "",
    first_name_kana: "",
    email: "",
  });

  useEffect(() => {
    fetchCompany();
    fetchRecruiters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // モーダルを開いたときにフォームをリセット
  useEffect(() => {
    if (modal.isOpen) {
      setErrorMessage("");
      setFieldErrors({});
      if (!editingRecruiter) {
        setFormData({
          last_name: "",
          first_name: "",
          last_name_kana: "",
          first_name_kana: "",
          email: "",
        });
      }
    }
  }, [modal.isOpen, editingRecruiter]);

  const fetchCompany = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single();

    if (error) {
      console.error("企業取得エラー:", error);
      return;
    }

    setCompany(data);
  };

  const fetchRecruiters = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      // まずcreated_atでソートを試みる
      const query = supabase
        .from("profiles")
        .select("*")
        .eq("company_id", companyId)
        .eq("role", "recruiter"); // リクルーターのみを取得

      // created_atでソートを試みる
      let data, error;
      try {
        const result = await query.order("created_at", { ascending: false });
        data = result.data;
        error = result.error;
      } catch (orderError) {
        // created_atが存在しない場合はupdated_atでソート
        console.warn("created_atでソート失敗、updated_atでソートします:", orderError);
        const result = await supabase
          .from("profiles")
          .select("*")
          .eq("company_id", companyId)
          .eq("role", "recruiter")
          .order("updated_at", { ascending: false });
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error("担当者取得エラー:", JSON.stringify(error, null, 2));
        return;
      }

      type RecruiterItem = {
        id: string;
        last_name: string;
        first_name: string;
        last_name_kana: string;
        first_name_kana: string;
        email: string;
        created_at?: string;
        updated_at?: string;
        company_id: string;
      };
      const formattedData = (data || []).map((recruiter: RecruiterItem) => ({
        ...recruiter,
        created_at: recruiter.created_at ? formatDateTime(recruiter.created_at) : (recruiter.updated_at ? formatDateTime(recruiter.updated_at) : ""),
        updated_at: recruiter.updated_at ? formatDateTime(recruiter.updated_at) : "",
      }));

      setRecruiters(formattedData);
    } catch (err) {
      console.error("予期しないエラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingRecruiter(null);
    setFormData({
      last_name: "",
      first_name: "",
      last_name_kana: "",
      first_name_kana: "",
      email: "",
    });
    modal.open();
  };

  const handleOpenEditModal = (recruiter: Recruiter) => {
    setEditingRecruiter(recruiter);
    setFormData({
      last_name: recruiter.last_name,
      first_name: recruiter.first_name,
      last_name_kana: recruiter.last_name_kana,
      first_name_kana: recruiter.first_name_kana,
      email: recruiter.email,
    });
    modal.open();
  };

  const handleOpenDeleteModal = (recruiter: Recruiter) => {
    setDeletingRecruiter(recruiter);
    deleteConfirmModal.open();
  };

  const handleDelete = async () => {
    if (!deletingRecruiter) return;

    setIsDeleting(true);
    try {
      const result = await deleteUser(deletingRecruiter.id);

      if (!result.success) {
        setErrorMessage(result.error || "削除に失敗しました");
        setIsDeleting(false);
        return;
      }

      deleteConfirmModal.close();
      setDeletingRecruiter(null);
      fetchRecruiters();
    } catch (error: unknown) {
      console.error("エラー:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "削除に失敗しました"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    const errors: typeof fieldErrors = {};

    // バリデーション
    if (!formData.last_name.trim()) {
      errors.last_name = "姓を入力してください";
    }
    if (!formData.first_name.trim()) {
      errors.first_name = "名を入力してください";
    }

    // カタカナバリデーション
    const lastKanaError = validateKatakana(formData.last_name_kana, "姓カナ");
    if (lastKanaError) {
      errors.last_name_kana = lastKanaError;
    }

    const firstKanaError = validateKatakana(formData.first_name_kana, "名カナ");
    if (firstKanaError) {
      errors.first_name_kana = firstKanaError;
    }

    // 編集モードの場合はメールアドレスのバリデーションをスキップ
    if (!editingRecruiter) {
      if (!formData.email.trim()) {
        errors.email = "メールアドレスを入力してください";
      } else {
        // メールアドレスの形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errors.email = "有効なメールアドレスを入力してください";
        }
      }
    }

    setFieldErrors(errors);

    // エラーがある場合は処理を中断
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      if (editingRecruiter) {
        // 更新（サーバーアクションを使用）
        const { email, ...updateData } = formData;
        const result = await updateRecruiterProfile(editingRecruiter.id, updateData);

        if (!result.success) {
          setErrorMessage(result.error || "更新に失敗しました");
        } else {
          modal.close();
          fetchRecruiters();
        }
      } else {
        // 新規作成
        // 先にauth.usersにアカウントを作成し、そのIDでprofilesに登録
        const result = await createRecruiterUser(
          formData.email,
          "", // パスワードは自動生成
          companyId,
          formData
        );

        if (!result.success) {
          const errorMessage = result.error || "リクルーターアカウントの作成に失敗しました。";
          console.error("アカウント作成エラー:", {
            error: result.error,
            message: errorMessage,
            fullResult: result,
          });
          setErrorMessage(errorMessage);
          return;
        }

        // パスワードを表示（開発環境のみ、本番環境では別の方法で通知）
        if (result.password) {
          console.log(
            `リクルーターアカウントが作成されました。パスワード: ${result.password}`
          );
          // 本番環境では、パスワードを安全な方法で通知する必要があります
        }

        modal.close();
        fetchRecruiters();
      }
    } catch (error: unknown) {
      console.error("エラー:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "処理に失敗しました"
      );
    }
  };

  return (
    <div>
      {/* 担当者追加・編集モーダル */}
      <Modal isOpen={modal.isOpen} onClose={modal.close} hideFooter>
        <div className="w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {editingRecruiter ? "担当者編集" : "担当者追加"}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  姓 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded ${
                    fieldErrors.last_name ? "border-red-500" : ""
                  }`}
                  value={formData.last_name}
                  onChange={(e) => {
                    setFormData({ ...formData, last_name: e.target.value });
                    if (fieldErrors.last_name) {
                      setFieldErrors({ ...fieldErrors, last_name: undefined });
                    }
                  }}
                />
                {fieldErrors.last_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.last_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded ${
                    fieldErrors.first_name ? "border-red-500" : ""
                  }`}
                  value={formData.first_name}
                  onChange={(e) => {
                    setFormData({ ...formData, first_name: e.target.value });
                    if (fieldErrors.first_name) {
                      setFieldErrors({ ...fieldErrors, first_name: undefined });
                    }
                  }}
                />
                {fieldErrors.first_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.first_name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  姓カナ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded ${
                    fieldErrors.last_name_kana ? "border-red-500" : ""
                  }`}
                  value={formData.last_name_kana}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      last_name_kana: e.target.value,
                    });
                    if (fieldErrors.last_name_kana) {
                      setFieldErrors({
                        ...fieldErrors,
                        last_name_kana: undefined,
                      });
                    }
                  }}
                />
                {fieldErrors.last_name_kana && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.last_name_kana}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  名カナ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded ${
                    fieldErrors.first_name_kana ? "border-red-500" : ""
                  }`}
                  value={formData.first_name_kana}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      first_name_kana: e.target.value,
                    });
                    if (fieldErrors.first_name_kana) {
                      setFieldErrors({
                        ...fieldErrors,
                        first_name_kana: undefined,
                      });
                    }
                  }}
                />
                {fieldErrors.first_name_kana && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.first_name_kana}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              {editingRecruiter ? (
                <div className="w-full px-3 py-2 text-gray-900">
                  {formData.email}
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    className={`w-full px-3 py-2 border rounded ${
                      fieldErrors.email ? "border-red-500" : ""
                    }`}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) {
                        setFieldErrors({ ...fieldErrors, email: undefined });
                      }
                    }}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 text-sm text-red-600">{errorMessage}</div>
          )}

          <div className="mt-6 flex gap-2">
            <Button
              onClick={handleSubmit}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              {editingRecruiter ? "更新" : "登録"}
            </Button>
            <Button
              onClick={modal.close}
              variant="light"
              size="lg"
              className="flex-1"
            >
              キャンセル
            </Button>
          </div>
        </div>
      </Modal>

      <h2 className="text-xl font-semibold mb-4">担当者管理</h2>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <div className="flex my-5 gap-10 font-bold items-center">
        <p>
          対象企業：
          {company ? company.name : "読み込み中..."}
        </p>
        <Button
          onClick={() => router.push("/admin/companies")}
          variant="light"
          size="sm"
        >
          戻る
        </Button>
      </div>

      {/* 担当者一覧 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">
            担当者一覧 ({recruiters.length}名)
          </h3>
          <Button onClick={handleOpenCreateModal} variant="primary" size="lg">
            ＋担当者を追加
          </Button>
        </div>
        <Table
          headers={recruiterHeaders}
          data={recruiters}
          isLoading={isLoading}
          renderActions={(row: Recruiter) => (
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => handleOpenEditModal(row)}
                variant="light"
                size="sm"
              >
                編集
              </Button>
              <Button
                onClick={() => handleOpenDeleteModal(row)}
                variant="danger"
                size="sm"
              >
                削除
              </Button>
            </div>
          )}
        />
      </div>

      {/* 削除確認モーダル */}
      <ConfirmModal
        isOpen={deleteConfirmModal.isOpen}
        onClose={() => {
          if (!isDeleting) {
            deleteConfirmModal.close();
            setDeletingRecruiter(null);
          }
        }}
        message={
          deletingRecruiter
            ? `担当者「${deletingRecruiter.last_name} ${deletingRecruiter.first_name}」を削除しますか？この操作は取り消せません。`
            : ""
        }
        reservation={null}
        onConfirm={handleDelete}
        isProcessing={isDeleting}
      />
    </div>
  );
}
