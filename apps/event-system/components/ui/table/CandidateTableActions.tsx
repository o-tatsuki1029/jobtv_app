"use client";

import Button from "@/components/ui/Button";
import { Candidate } from "@/types/candidate.types";

type CandidateTableActionsProps = {
  candidate: Candidate;
  onEdit: (candidate: Candidate) => void;
};

export default function CandidateTableActions({
  candidate,
  onEdit,
}: CandidateTableActionsProps) {
  return (
    <div className="px-3 py-2 flex justify-end gap-2 font-semibold">
      <Button onClick={() => onEdit(candidate)} variant="light">
        編集
      </Button>
    </div>
  );
}
