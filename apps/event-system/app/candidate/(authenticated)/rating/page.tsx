import CandidateRatingPageClient from "./page-client";
import { getUserInfo } from "@jobtv-app/shared/auth";
import { getCandidateSession } from "@/utils/api/routes/candidate-session";
import { getCandidateInfo } from "@/utils/api/routes/candidate-info";
import { getCandidateEvents } from "@/utils/api/routes/candidate-events";
import { getCandidateCompanies } from "@/utils/api/routes/candidate-companies";
import { formatEventDisplay } from "@/utils/data/event";

export default async function CandidateRatingPage() {
  // 認証チェックはレイアウトで実施済み
  // 管理者が学生としてアクセスする場合の処理
  const userInfo = await getUserInfo();
  const isAdmin = userInfo?.role === "admin";
  
  let loggedInCandidateId: string | undefined = undefined;
  let initialData = null;

  if (!isAdmin) {
    // 学生としてログインしている場合、データを事前取得
    try {
      // 並列でデータを取得
      const [sessionData, infoData] = await Promise.all([
        getCandidateSession(),
        getCandidateInfo(),
      ]);

      loggedInCandidateId = sessionData.candidateId || undefined;
      const eventId = sessionData.eventId;

      // イベントと企業データを並列で取得（eventIdがある場合のみ）
      if (loggedInCandidateId) {
        const [eventsData, companiesData] = await Promise.all([
          getCandidateEvents(loggedInCandidateId),
          eventId && loggedInCandidateId
            ? getCandidateCompanies(eventId, loggedInCandidateId).catch(() => ({ companies: [] }))
            : Promise.resolve({ companies: [] }),
        ]);

        // イベント名を企業データに追加
        const events = eventsData.events || [];
        const selectedEvent = eventId ? events.find((e) => e.id === eventId) : null;
        const eventName = selectedEvent ? formatEventDisplay(selectedEvent) : "";
        
        const companiesWithEventName = (companiesData.companies || []).map((company: {
          id: string;
          company_id: string;
          name: string;
          event_id: string;
          rating: number | null;
          comment: string | null;
        }) => ({
          ...company,
          event_name: eventName,
        }));

        initialData = {
          candidateId: loggedInCandidateId,
          eventId: eventId || null,
          candidate: infoData.candidate,
          events: events,
          companies: companiesWithEventName,
          selectedEventId: eventId || null,
        };
      }
    } catch (error) {
      // エラーが発生した場合は、クライアント側で取得する
      console.error("サーバー側でのデータ取得エラー:", error);
    }
  }

  return (
    <CandidateRatingPageClient
      loggedInCandidateId={isAdmin ? undefined : loggedInCandidateId}
      isAdmin={isAdmin}
      initialData={initialData}
    />
  );
}

