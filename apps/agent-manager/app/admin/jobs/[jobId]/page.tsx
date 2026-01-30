import { Suspense } from "react";
import { JobDetailContent } from "@/components/job-detail-content";

async function JobDetailContentWrapper({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <JobDetailContent jobId={jobId} />;
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">求人詳細</h1>
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        </div>
      }
    >
      <JobDetailContentWrapper params={params} />
    </Suspense>
  );
}
