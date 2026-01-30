"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Briefcase } from "lucide-react";
import Link from "next/link";
import type { Tables } from "@/types";

type ApplicationRow = Tables<"applications">;

interface Application extends ApplicationRow {
  job_postings?: {
    title: string;
    companies?: {
      name: string;
    };
  };
}

interface CandidateApplicationsListProps {
  applications: Application[];
}

export function CandidateApplicationsList({
  applications,
}: CandidateApplicationsListProps) {
  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      applied: "応募済み",
      document_screening: "書類選考",
      first_interview: "一次面接",
      second_interview: "二次面接",
      final_interview: "最終面接",
      offer: "内定",
      rejected: "不採用",
      withdrawn: "辞退",
    };
    return statusMap[status] || status;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "offer":
        return "default";
      case "rejected":
      case "withdrawn":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          応募履歴
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">
                      {application.job_postings?.title || "不明"}
                    </p>
                    <Badge
                      variant={getStatusBadgeVariant(
                        application.current_status,
                      )}
                    >
                      {getStatusLabel(application.current_status)}
                    </Badge>
                  </div>
                  {application.job_postings?.companies && (
                    <p className="text-sm text-muted-foreground">
                      企業: {application.job_postings.companies.name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    応募日:{" "}
                    {new Date(application.applied_at).toLocaleDateString(
                      "ja-JP",
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/applications/${application.id}`}>
                      詳細・進捗管理
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              応募履歴がありません
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
