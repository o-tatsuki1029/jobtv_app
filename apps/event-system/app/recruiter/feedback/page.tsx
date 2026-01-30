import RecruiterFeedbackPageClient from "./page-client";
import { getUserInfo } from "@/utils/auth/get-user-info";

export default async function RecruiterFeedbackPage() {
  // 認証チェックはレイアウトで実施済み
  const userInfo = await getUserInfo();

  return (
    <RecruiterFeedbackPageClient
      isAdmin={userInfo?.role === "admin"}
      loggedInRecruiterId={userInfo?.recruiterId}
      loggedInCompanyId={userInfo?.companyId}
    />
  );
}
