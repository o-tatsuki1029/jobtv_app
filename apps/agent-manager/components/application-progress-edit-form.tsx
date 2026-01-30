"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ApplicationProgressEditFormProps {
  progressId: string;
  applicationId: string;
  initialData: {
    status: string;
    status_date: string;
    notes?: string | null;
  };
  onSuccess?: () => void;
  className?: string;
}

const statusOptions = [
  { value: "applied", label: "応募済み" },
  { value: "document_screening", label: "書類選考" },
  { value: "first_interview", label: "一次面接" },
  { value: "second_interview", label: "二次面接" },
  { value: "final_interview", label: "最終面接" },
  { value: "offer", label: "内定" },
  { value: "rejected", label: "不採用" },
  { value: "withdrawn", label: "辞退" },
];

export function ApplicationProgressEditForm({
  progressId,
  applicationId,
  initialData,
  onSuccess,
  className,
}: ApplicationProgressEditFormProps) {
  const [status, setStatus] = useState(initialData.status);
  const [statusDate, setStatusDate] = useState(
    initialData.status_date.split("T")[0]
  );
  const [notes, setNotes] = useState(initialData.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("ログインが必要です");
      }

      // 進捗履歴を更新
      const { error: updateError } = await supabase
        .from("application_progress")
        .update({
          status: status,
          status_date: statusDate,
          interview_date: null,
          interview_location: null,
          notes: notes || null,
          updated_by: user.id,
        })
        .eq("id", progressId);

      if (updateError) {
        throw new Error(
          `更新エラー: ${updateError.message} (${
            updateError.code || "unknown"
          })`
        );
      }

      // 応募の現在のステータスを更新（最新の進捗履歴のステータスに）
      const { data: latestProgress } = await supabase
        .from("application_progress")
        .select("status")
        .eq("application_id", applicationId)
        .order("status_date", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (latestProgress) {
        const { error: applicationUpdateError } = await supabase
          .from("applications")
          .update({ current_status: latestProgress.status })
          .eq("id", applicationId);

        if (applicationUpdateError) {
          console.warn(
            "進捗履歴は更新されましたが、応募ステータスの更新に失敗しました:",
            applicationUpdateError.message
          );
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.error("Form error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("エラーが発生しました: " + String(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="status">
            ステータス <span className="text-red-500">*</span>
          </Label>
          <Select value={status} onValueChange={setStatus} required>
            <SelectTrigger>
              <SelectValue placeholder="ステータスを選択" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status_date">
            ステータス日付 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="status_date"
            type="date"
            value={statusDate}
            onChange={(e) => setStatusDate(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">備考</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="進捗に関するメモを入力"
            rows={4}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? "更新中..." : "更新"}
          </Button>
        </div>
      </div>
    </form>
  );
}
