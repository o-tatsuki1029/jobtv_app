"use client";

import Modal from "@/components/ui/modals/Modal";
import CandidateRatingForm from "@/components/evaluation/CandidateRatingForm";

type CandidateRatingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  companyId: string;
  eventId: string;
  candidateName?: string;
  companyName?: string;
  eventName?: string;
  existingRating?: number | null;
  existingLikedPoints?: string[] | null;
  isAdmin?: boolean;
  onSuccess?: () => void;
};

export default function CandidateRatingModal({
  isOpen,
  onClose,
  candidateId,
  companyId,
  eventId,
  candidateName,
  companyName,
  eventName,
  existingRating,
  existingLikedPoints,
  isAdmin = false,
  onSuccess,
}: CandidateRatingModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} hideFooter maxWidth="2xl">
      <CandidateRatingForm
        candidateId={candidateId}
        companyId={companyId}
        eventId={eventId}
        candidateName={candidateName}
        companyName={companyName}
        eventName={eventName}
        existingRating={existingRating}
        existingLikedPoints={existingLikedPoints}
        isAdmin={isAdmin}
        onSuccess={() => {
          if (onSuccess) onSuccess();
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
}
