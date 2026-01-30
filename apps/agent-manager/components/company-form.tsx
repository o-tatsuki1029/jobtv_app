"use client";

import { cn, getErrorMessage } from "@/utils";
import { createCompany, updateCompany } from "@/lib/actions/company-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface CompanyFormProps {
  className?: string;
  initialData?: {
    id?: string;
    name?: string;
    notes?: string;
  };
  onSuccess?: () => void;
}

export function CompanyForm({
  className,
  initialData,
  onSuccess,
  ...props
}: CompanyFormProps & React.ComponentPropsWithoutRef<"form">) {
  const [name, setName] = useState(initialData?.name || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const companyData = {
        name,
        notes: notes || null,
      };

      let result;
      if (isEditMode && initialData?.id) {
        // 更新
        result = await updateCompany(initialData.id, companyData);
      } else {
        // 新規作成
        result = await createCompany(companyData);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Form error:", error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">
            企業名 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="株式会社サンプル"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">メモ</Label>
          <Textarea
            id="notes"
            placeholder="企業に関するメモを入力してください"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading
              ? isEditMode
                ? "更新中..."
                : "登録中..."
              : isEditMode
              ? "更新"
              : "登録"}
          </Button>
        </div>
      </div>
    </form>
  );
}
