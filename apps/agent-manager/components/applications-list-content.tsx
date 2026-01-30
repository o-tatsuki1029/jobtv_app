import { getApplications } from "@/lib/actions/application-actions";
import { ApplicationsList } from "@/components/applications-list";

export async function ApplicationsListContent() {
  const { data: applications, error } = await getApplications();

  if (error) {
    console.error("Error fetching applications:", error);
    return (
      <div className="text-center py-8">
        <p className="text-sm text-destructive">
          エラーが発生しました: {error}
        </p>
      </div>
    );
  }

  return <ApplicationsList applications={applications || []} />;
}
