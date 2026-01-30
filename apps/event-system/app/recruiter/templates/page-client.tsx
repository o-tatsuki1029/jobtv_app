"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import Modal from "@/components/ui/modals/Modal";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/table/Table";
import { FormField, SelectInput } from "@/components/ui/form/FormField";
import { useModal } from "@/hooks/useModal";
import {
  supabaseInsert,
  supabaseUpdate,
  supabaseDelete,
} from "@/lib/actions/supabase-actions";

type CommentTemplate = {
  id: string;
  company_id: string;
  template_text: string;
  created_at: string;
  updated_at: string;
};

type Company = {
  id: string;
  name: string;
};

const headers: { label: string; key: keyof CommentTemplate }[] = [
  { label: "テンプレート", key: "template_text" },
  { label: "作成日", key: "created_at" },
  { label: "更新日", key: "updated_at" },
];

type RecruiterTemplatesPageClientProps = {
  isAdmin: boolean;
  initialCompanyId?: string;
};

export default function RecruiterTemplatesPageClient({
  isAdmin,
  initialCompanyId,
}: RecruiterTemplatesPageClientProps) {
  const modal = useModal();

  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    initialCompanyId || ""
  );
  const [company, setCompany] = useState<Company | null>(null);
  const [templates, setTemplates] = useState<CommentTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] =
    useState<CommentTemplate | null>(null);
  const [templateText, setTemplateText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 企業一覧を取得（管理者の場合のみ）
  useEffect(() => {
    if (isAdmin) {
      fetchAllCompanies();
    }
  }, [isAdmin]);

  // 初期企業IDが設定されている場合は選択
  useEffect(() => {
    if (initialCompanyId) {
      setSelectedCompanyId(initialCompanyId);
    }
  }, [initialCompanyId]);

  // 選択された企業が変更されたら、企業情報とテンプレートを取得
  useEffect(() => {
    if (selectedCompanyId) {
      fetchCompany();
      fetchTemplates();
    } else {
      setCompany(null);
      setTemplates([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCompanyId]);

  const fetchAllCompanies = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("id, name")
      .order("name", { ascending: true });

    if (error) {
      console.error("企業一覧取得エラー:", error);
      setError("企業一覧の取得に失敗しました");
    } else {
      setAllCompanies(data || []);
    }
  };

  const fetchCompany = async () => {
    if (!selectedCompanyId) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("id, name")
      .eq("id", selectedCompanyId)
      .single();

    if (error) {
      console.error("企業取得エラー:", error);
      setError("企業情報の取得に失敗しました");
    } else {
      setCompany(data);
    }
  };

  const fetchTemplates = useCallback(async () => {
    if (!selectedCompanyId) {
      setTemplates([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("comment_templates")
      .select("*")
      .eq("company_id", selectedCompanyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("テンプレート取得エラー:", error);
      setError("テンプレートの取得に失敗しました");
    } else {
      setTemplates(data || []);
    }
    setIsLoading(false);
  }, [selectedCompanyId]);

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    setTemplateText("");
    setError(null);
    modal.open();
  };

  const handleOpenEditModal = (template: CommentTemplate) => {
    setEditingTemplate(template);
    setTemplateText(template.template_text);
    setError(null);
    modal.open();
  };

  const handleCloseModal = () => {
    modal.close();
    setEditingTemplate(null);
    setTemplateText("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!templateText.trim()) {
      setError("テンプレートを入力してください");
      setIsSubmitting(false);
      return;
    }

    if (templateText.length > 60) {
      setError("テンプレートは60字以内で入力してください");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingTemplate) {
        // 更新
        const { error } = await supabaseUpdate(
          "comment_templates",
          { template_text: templateText.trim() },
          { id: editingTemplate.id }
        );

        if (error) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "更新に失敗しました";
          setError(errorMessage);
          setIsSubmitting(false);
          return;
        }
      } else {
        // 新規作成
        if (!selectedCompanyId) {
          setError("企業を選択してください");
          setIsSubmitting(false);
          return;
        }

        const { error } = await supabaseInsert("comment_templates", {
          company_id: selectedCompanyId,
          template_text: templateText.trim(),
        });

        if (error) {
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: string }).message)
              : "登録に失敗しました";
          setError(errorMessage);
          setIsSubmitting(false);
          return;
        }
      }

      handleCloseModal();
      fetchTemplates();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm("このテンプレートを削除しますか？")) {
      return;
    }

    try {
      const { error } = await supabaseDelete("comment_templates", {
        id: templateId,
      });

      if (error) {
        const errorMessage =
          error && typeof error === "object" && "message" in error
            ? String((error as { message: string }).message)
            : "削除に失敗しました";
        setError(errorMessage);
        return;
      }

      fetchTemplates();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "エラーが発生しました");
    }
  };

  const displayData = templates.map((template) => ({
    ...template,
    created_at: new Date(template.created_at).toLocaleString("ja-JP"),
    updated_at: new Date(template.updated_at).toLocaleString("ja-JP"),
  }));

  const companyOptions = allCompanies.map((c) => ({ value: c.id, label: c.name }));

  return (
    <div className="pb-8">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">コメントテンプレート管理</h2>
        {isAdmin && (
          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
            管理者プレビュー
          </span>
        )}
      </div>

      {isAdmin && (
        <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-lg">
          <div className="text-xs font-bold text-red-600 mb-2">
            管理者プレビューモード
          </div>
          <FormField label="企業" className="text-sm font-medium">
            <SelectInput
              name="company_id"
              value={selectedCompanyId}
              onChange={(e) => {
                setSelectedCompanyId(e.target.value);
                setError(null);
              }}
              options={companyOptions}
              placeholder="企業を選択"
              className="px-3 py-2 border rounded w-full text-sm min-h-[40px]"
            />
          </FormField>
        </div>
      )}

      {!isAdmin && company && (
        <p className="text-sm text-gray-600 mb-4">
          企業: {company.name}
        </p>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {selectedCompanyId && (
        <div className="my-5 flex justify-end">
          <Button variant="primary" size="lg" onClick={handleOpenCreateModal}>
            ＋テンプレート追加
          </Button>
        </div>
      )}

      <Modal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        hideFooter
        maxWidth="3xl"
      >
        <form onSubmit={handleSubmit} className="w-full pb-6">
          <h2 className="text-2xl font-bold mb-6">
            {editingTemplate ? "テンプレート編集" : "テンプレート追加"}
          </h2>

          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-3">
              テンプレート <span className="text-gray-500">(60字以内)</span>
            </label>
            <textarea
              value={templateText}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 60) {
                  setTemplateText(value);
                  setError(null);
                }
              }}
              placeholder="テンプレートを入力（60字以内）"
              className="w-full px-4 py-3 border border-gray-300 rounded text-base resize-none"
              rows={4}
              maxLength={60}
              required
            />
            <div className="mt-2 text-sm text-gray-500 text-right">
              {templateText.length}/60
            </div>
          </div>

          {error && <div className="mb-4 text-base text-red-600">{error}</div>}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="flex-1 bg-gray-200 text-gray-700 px-10 py-3 text-base rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 text-white px-10 py-3 text-base rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {isSubmitting ? "送信中..." : editingTemplate ? "更新" : "登録"}
            </button>
          </div>
        </form>
      </Modal>

      {selectedCompanyId ? (
        <Table
          variant="ipad"
          headers={headers}
          data={displayData}
          isLoading={isLoading}
          renderActions={(row) => {
            const template = templates.find(
              (t) => t.id === (row as { id: string }).id
            );
            if (!template) return null;
            return (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleOpenEditModal(template)}
                >
                  編集
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(template.id)}
                >
                  削除
                </Button>
              </div>
            );
          }}
        />
      ) : (
        <div className="text-center text-gray-500 py-8">
          {isAdmin ? "企業を選択してください" : "企業情報の取得に失敗しました"}
        </div>
      )}
    </div>
  );
}
