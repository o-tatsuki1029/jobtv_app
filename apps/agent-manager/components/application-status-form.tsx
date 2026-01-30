"use client";

import { cn, getErrorMessage } from "@/utils";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface ApplicationStatusFormProps {
  className?: string;
  applicationId: string;
  currentStatus: string;
  availableStatuses?: string[];
  showCard?: boolean;
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

const getTodayDate = () => new Date().toISOString().split("T")[0];

export function ApplicationStatusForm({
  className,
  applicationId,
  currentStatus,
  availableStatuses,
  showCard = true,
  ...props
}: ApplicationStatusFormProps & React.ComponentPropsWithoutRef<"form">) {
  const [status, setStatus] = useState(currentStatus);
  const [statusDate, setStatusDate] = useState(getTodayDate());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // 利用可能なステータスに基づいてフィルタリング（現在のステータスは常に含める）
  const filteredStatusOptions =
    availableStatuses && availableStatuses.length > 0
      ? statusOptions.filter(
          (option) =>
            availableStatuses.includes(option.value) ||
            option.value === currentStatus
        )
      : statusOptions;

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

      // 現在のステータスを取得（previous_statusとして記録するため）
      const { data: currentApplication } = await supabase
        .from("applications")
        .select("current_status")
        .eq("id", applicationId)
        .single();

      // 進捗履歴を追加
      const { error: progressError } = await supabase
        .from("application_progress")
        .insert([
          {
            application_id: applicationId,
            previous_status: currentApplication?.current_status || null,
            status: status,
            status_date: statusDate,
            interview_date: null,
            interview_location: null,
            notes: notes || null,
            created_by: user.id,
          },
        ]);

      if (progressError) {
        throw new Error(
          `進捗追加エラー: ${progressError.message} (${
            progressError.code || "unknown"
          })`
        );
      }

      // 応募の現在のステータスを更新
      const { error: updateError } = await supabase
        .from("applications")
        .update({ current_status: status })
        .eq("id", applicationId);

      if (updateError) {
        throw new Error(
          `ステータス更新エラー: ${updateError.message} (${
            updateError.code || "unknown"
          })`
        );
      }

      // フォームをリセット
      setStatusDate(getTodayDate());
      setNotes("");

      router.refresh();
    } catch (error: unknown) {
      console.error("Form error:", error);
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const formContent = (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
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
              {filteredStatusOptions.map((option) => (
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
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading || status === currentStatus}
          >
            {isLoading ? "更新中..." : "進捗を更新"}
          </Button>
        </div>
      </div>
    </form>
  );

  if (!showCard) return formContent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>進捗更新</CardTitle>
      </CardHeader>
      <CardContent>{formContent}</CardContent>
    </Card>
  );
}
