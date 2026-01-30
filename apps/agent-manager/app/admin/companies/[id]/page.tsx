import { Suspense } from "react";
import { CompanyDetailContent } from "@/components/company-detail-content";

async function CompanyDetailContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CompanyDetailContent id={id} />;
}

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">企業詳細</h1>
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          </div>
        </div>
      }
    >
      <CompanyDetailContentWrapper params={params} />
    </Suspense>
  );
}
