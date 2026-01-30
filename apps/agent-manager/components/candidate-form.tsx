"use client";

import { cn } from "@/utils";
import {
  createCandidate,
  updateCandidate,
} from "@/lib/actions/candidate-actions";
import { getErrorMessage } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CandidateFormProps {
  className?: string;
  initialData?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    first_name_kana?: string;
    last_name_kana?: string;
    email?: string;
    phone?: string;
    notes?: string;
  };
  onSuccess?: () => void;
}

export function CandidateForm({
  className,
  initialData,
  onSuccess,
  ...props
}: CandidateFormProps & React.ComponentPropsWithoutRef<"form">) {
  const [firstName, setFirstName] = useState(initialData?.first_name || "");
  const [lastName, setLastName] = useState(initialData?.last_name || "");
  const [firstNameKana, setFirstNameKana] = useState(
    initialData?.first_name_kana || "",
  );
  const [lastNameKana, setLastNameKana] = useState(
    initialData?.last_name_kana || "",
  );
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEditMode = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const candidateData = {
        first_name: firstName,
        last_name: lastName,
        first_name_kana: firstNameKana,
        last_name_kana: lastNameKana,
        email,
        phone: phone || null,
        notes: notes || null,
      };

      let result;
      if (isEditMode && initialData?.id) {
        // 更新
        result = await updateCandidate(initialData.id, candidateData);
      } else {
        // 新規作成
        result = await createCandidate(candidateData);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        // 編集モードの場合はページをリフレッシュ
        if (isEditMode) {
          router.refresh();
        }
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
      className={cn("flex flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="last_name">
            姓 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="last_name"
            type="text"
            placeholder="山田"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="first_name">
            名 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="first_name"
            type="text"
            placeholder="太郎"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="last_name_kana">姓（カナ）</Label>
          <Input
            id="last_name_kana"
            type="text"
            placeholder="ヤマダ"
            value={lastNameKana}
            onChange={(e) => setLastNameKana(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="first_name_kana">名（カナ）</Label>
          <Input
            id="first_name_kana"
            type="text"
            placeholder="タロウ"
            value={firstNameKana}
            onChange={(e) => setFirstNameKana(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">
            メールアドレス <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="yamada@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="03-1234-5678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">メモ</Label>
          <Textarea
            id="notes"
            placeholder="求職者に関するメモを入力してください"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
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
