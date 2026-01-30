"use client";

import Modal from "@/components/ui/modals/Modal";
import RatingModalForm from "@/app/recruiter/rating/RatingModalForm";

type RecruiterRatingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  recruiterId: string;
  candidateId: string;
  eventId: string;
  candidateName?: string;
  candidateKana?: string;
  seatNumber?: string | null;
  schoolName?: string | null;
  candidateRating?: number | null;
  candidateLikedPoints?: string[] | null;
  eventName?: string;
  recruiterName?: string;
  onSuccess?: () => void;
};

export default function RecruiterRatingModal({
  isOpen,
  onClose,
  companyId,
  recruiterId,
  candidateId,
  eventId,
  candidateName,
  candidateKana,
  seatNumber,
  schoolName,
  candidateRating,
  candidateLikedPoints,
  eventName,
  recruiterName,
  onSuccess,
}: RecruiterRatingModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideFooter
      className="max-w-[1250px]"
    >
      <RatingModalForm
        onClose={async () => {
          if (onSuccess) await onSuccess();
          onClose();
        }}
        companyId={companyId}
        recruiterId={recruiterId}
        candidateId={candidateId}
        eventId={eventId}
        candidateName={candidateName}
        candidateKana={candidateKana}
        seatNumber={seatNumber}
        schoolName={schoolName}
        candidateRating={candidateRating}
        candidateLikedPoints={candidateLikedPoints}
        eventName={eventName}
        recruiterName={recruiterName}
      />
    </Modal>
  );
}
