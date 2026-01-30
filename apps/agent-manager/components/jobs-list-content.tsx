import { getJobs } from "@/lib/actions/job-actions";
import { JobsList } from "@/components/jobs-list";

export async function JobsListContent() {
  const { data: jobs, error } = await getJobs();

  if (error) {
    console.error("Error fetching jobs:", error);
    return (
      <div className="text-center py-8">
        <p className="text-sm text-destructive">
          エラーが発生しました: {error}
        </p>
      </div>
    );
  }

  return <JobsList jobs={jobs || []} />;
}
