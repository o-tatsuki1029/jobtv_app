"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";

interface ProgressNotesEditFormProps {
  progressId: string;
  initialNotes?: string | null;
  initialStatusDate?: string;
  onSuccess?: () => void;
  className?: string;
}

export function ProgressNotesEditForm({
  progressId,
  initialNotes,
  initialStatusDate,
  onSuccess,
  className,
}: ProgressNotesEditFormProps) {
  const [notes, setNotes] = useState(initialNotes || "");
  const [statusDate, setStatusDate] = useState(
    initialStatusDate
      ? new Date(initialStatusDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
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

      // コメントと日付を更新
      const { error: updateError } = await supabase
        .from("application_progress")
        .update({
          notes: notes || null,
          status_date: statusDate,
          updated_by: user.id,
        })
        .eq("id", progressId);

      if (updateError) {
        throw new Error(
          `更新エラー: ${updateError.message} (${
            updateError.code || "unknown"
          })`,
        );
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
      className={cn("flex flex-col gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="status_date">
          日付 <span className="text-red-500">*</span>
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
        <Label htmlFor="notes">メモ</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="メモを入力してください"
          rows={4}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "更新中..." : "更新"}
        </Button>
      </div>
    </form>
  );
}
