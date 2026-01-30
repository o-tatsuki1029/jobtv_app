import { Suspense } from "react";
import { JobApplicationsContent } from "@/components/job-applications-content";

async function JobApplicationsContentWrapper({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  return <JobApplicationsContent jobId={jobId} />;
}

export default function JobApplicationsPage({
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
              <h1 className="text-3xl font-bold tracking-tight">応募者一覧</h1>
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        </div>
      }
    >
      <JobApplicationsContentWrapper params={params} />
    </Suspense>
  );
}
