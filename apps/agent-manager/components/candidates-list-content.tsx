import { CandidatesList } from "@/components/candidates-list";
import { getCandidates, type CandidateData } from "@/lib/actions/candidate-actions";

type Candidate = CandidateData;

export async function CandidatesListContent() {
  // Server Actions経由でデータを取得
  const { data: candidates, error } = await getCandidates();

  if (error) {
    console.error("Error fetching candidates:", error);
    return (
      <div className="text-center py-8">
        <p className="text-sm text-destructive">
          エラーが発生しました: {error}
        </p>
      </div>
    );
  }

  // idが存在するものだけをフィルター
  const validCandidates = (candidates || []).filter((c): c is Candidate & { id: string } => !!c.id);

  return <CandidatesList candidates={validCandidates} />;
}
