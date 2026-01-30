import { getScoreSheetData } from "@/lib/actions/score-sheet-actions";
import CandidateEvaluationDetail from "@/components/admin/matching/CandidateEvaluationDetail";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    eventId: string;
    candidateId: string;
  }>;
};

export default async function FeedbackDetailPage({ params }: PageProps) {
  const { eventId, candidateId } = await params;

  const result = await getScoreSheetData(eventId, candidateId);

  if (!result.success || !result.data) {
    return notFound();
  }

  return <CandidateEvaluationDetail data={result.data} />;
}
