"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/ui/modals/Modal";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/table/Table";
import { FormField, SelectInput } from "@/components/ui/form/FormField";
import { useModal } from "@/hooks/useModal";
import { useCommentTemplates } from "@/hooks/useCommentTemplates";
import { useCommentTemplateForm } from "@/hooks/useCommentTemplateForm";
import { useCompanySelection } from "@/hooks/useCompanySelection";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import CommentTemplateModalForm from "../../../../../components/ui/modals/CommentTemplateModalForm";
import ConfirmModal from "@/components/ui/modals/ConfirmModal";
import type { CommentTemplate } from "@/types/commentTemplate.types";

const headers: { label: string; key: keyof CommentTemplate }[] = [
  { label: "テンプレート", key: "template_text" },
  { label: "作成日", key: "created_at" },
  { label: "更新日", key: "updated_at" },
];

export default function CommentTemplatesPage() {
  const params = useParams();
  const router = useRouter();
  const urlCompanyId = params.id as string | undefined;

  const modal = useModal();
  const confirmModal = useConfirmModal();

  const {
    allCompanies,
    selectedCompanyId,
    error: companyError,
    setSelectedCompanyId,
    setError: setCompanyError,
  } = useCompanySelection(urlCompanyId);

  const {
    templates,
    isLoading,
    error: templatesError,
    fetchTemplates,
    deleteTemplate,
    setError: setTemplatesError,
  } = useCommentTemplates(selectedCompanyId);

  const {
    editingTemplate,
    setEditingTemplate,
    reset: resetForm,
  } = useCommentTemplateForm();

  // URLパラメータから企業IDが指定されている場合は初期値として設定
  useEffect(() => {
    if (urlCompanyId && urlCompanyId !== selectedCompanyId) {
      setSelectedCompanyId(urlCompanyId);
    }
  }, [urlCompanyId, selectedCompanyId, setSelectedCompanyId]);

  // 選択された企業が変更されたら、URLも更新
  useEffect(() => {
    if (selectedCompanyId && urlCompanyId !== selectedCompanyId) {
      router.replace(`/admin/companies/${selectedCompanyId}/templates`);
    }
  }, [selectedCompanyId, urlCompanyId, router]);

  const handleOpenCreateModal = () => {
    setEditingTemplate(null);
    resetForm();
    setTemplatesError(null);
    modal.open();
  };

  const handleOpenEditModal = (template: CommentTemplate) => {
    setEditingTemplate(template);
    setTemplatesError(null);
    modal.open();
  };

  const handleCloseModal = () => {
    modal.close();
    resetForm();
    setTemplatesError(null);
  };

  const handleDelete = (template: CommentTemplate) => {
    confirmModal.showConfirm("このテンプレートを削除しますか？", async () => {
      const result = await deleteTemplate(template.id);
      if (result.success) {
        fetchTemplates();
      }
    });
  };

  const displayData = useMemo(
    () =>
      templates.map((template) => ({
        ...template,
        created_at: template.created_at ? new Date(template.created_at).toLocaleString("ja-JP") : "-",
        updated_at: template.updated_at ? new Date(template.updated_at).toLocaleString("ja-JP") : "-",
      })),
    [templates]
  );

  const companyOptions = useMemo(
    () => allCompanies.map((c) => ({ value: c.id, label: c.name })),
    [allCompanies]
  );

  const error = companyError || templatesError;

  return (
    <div>
      <div className="mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/admin/companies")}
        >
          ← 企業一覧に戻る
        </Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">コメントテンプレート管理</h2>

      <div className="mb-4">
        <FormField label="企業" className="mb-3 text-sm font-medium">
          <SelectInput
            name="company_id"
            value={selectedCompanyId}
            onChange={(e) => {
              setSelectedCompanyId(e.target.value);
              setCompanyError(null);
              setTemplatesError(null);
            }}
            options={companyOptions}
            placeholder="企業を選択"
            className="px-3 py-2 border rounded w-full text-sm min-h-[40px]"
          />
        </FormField>
      </div>

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

      <Modal isOpen={modal.isOpen} onClose={handleCloseModal} hideFooter>
        <CommentTemplateModalForm
          isOpen={modal.isOpen}
          onClose={handleCloseModal}
          companyId={selectedCompanyId}
          editingTemplate={editingTemplate}
          onSuccess={fetchTemplates}
        />
      </Modal>

      <ConfirmModal
        isOpen={confirmModal.modal.isOpen}
        onClose={confirmModal.modal.close}
        message={confirmModal.confirmMessage}
        reservation={null}
        onConfirm={confirmModal.handleConfirm}
      />

      {selectedCompanyId ? (
        <Table
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
                  onClick={() => handleDelete(template)}
                >
                  削除
                </Button>
              </div>
            );
          }}
        />
      ) : (
        <div className="text-center text-gray-500 py-8">
          企業を選択してください
        </div>
      )}
    </div>
  );
}
