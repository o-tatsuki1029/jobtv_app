import EventSelectionPageClient from "./page-client";
import { getUserInfo } from "@/utils/auth/get-user-info";

export default async function EventSelectionPage() {
  // 認証チェックはレイアウトで実施済み
  const userInfo = await getUserInfo();

  return (
    <EventSelectionPageClient
      isAdmin={userInfo?.role === "admin"}
      loggedInRecruiterId={userInfo?.recruiterId}
      loggedInCompanyId={userInfo?.companyId}
    />
  );
}
