"use client";

import { useState, useEffect } from "react";
import { getJob } from "@/lib/actions/job-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { JobForm } from "@/components/job-form";
import { useRouter } from "next/navigation";
import type { Tables } from "@jobtv-app/shared/types";

interface JobDetailModalProps {
  jobId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId?: string;
}

type Job = Tables<"job_postings">;

export function JobDetailModal({
  jobId,
  open,
  onOpenChange,
}: JobDetailModalProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (open && jobId) {
      fetchJob();
    } else {
      setJob(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, jobId]);

  const fetchJob = async () => {
    if (!jobId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getJob(jobId);

      if (fetchError || !data || !data.id) {
        throw new Error(fetchError || "データの取得に失敗しました");
      }
      setJob(data as Job);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">読み込み中...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : job ? (
          <>
            <DialogHeader>
              <DialogTitle>求人情報を編集</DialogTitle>
              <DialogDescription>求人情報を編集します</DialogDescription>
            </DialogHeader>
            <JobForm
              initialData={{
                id: job.id,
                company_id: job.company_id,
                title: job.title,
                description: job.description || "",
                status: job.status,
              }}
              onSuccess={handleSuccess}
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
