import { cookies } from "next/headers";

export async function getCandidateSession() {
  const cookieStore = await cookies();
  const candidateId = cookieStore.get("candidate_id")?.value;
  const eventId = cookieStore.get("candidate_event_id")?.value;

  return {
    candidateId: candidateId || null,
    eventId: eventId || null,
  };
}

