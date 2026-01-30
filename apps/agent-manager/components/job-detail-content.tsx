import { getJob } from "@/lib/actions/job-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobApplicationsContent } from "@/components/job-applications-content";

interface JobDetailContentProps {
  jobId: string;
}

export async function JobDetailContent({ jobId }: JobDetailContentProps) {
  const { data: job, error: jobError } = await getJob(jobId);

  if (jobError || !job) {
    redirect("/admin/jobs");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
          <p className="text-muted-foreground">求人情報と応募者を管理します</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/jobs">← 一覧に戻る</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>求人情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">説明</p>
            <p className="mt-1">{job.description || "未設定"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ステータス</p>
            <p className="mt-1">{job.status}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">卒業年</p>
            <p className="mt-1">{job.graduation_year || "未設定"}</p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">応募者一覧</h2>
        <JobApplicationsContent jobId={jobId} />
      </div>
    </div>
  );
}
