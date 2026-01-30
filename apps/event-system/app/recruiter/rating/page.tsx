import RecruiterRatingPageClient from "./page-client";
import { getUserInfo } from "@/utils/auth/get-user-info";

export default async function RecruiterRatingPage() {
  // 認証チェックはレイアウトで実施済み
  const userInfo = await getUserInfo();

  return (
    <RecruiterRatingPageClient
      loggedInRecruiterId={userInfo?.recruiterId}
      loggedInCompanyId={userInfo?.companyId}
      isAdmin={userInfo?.role === "admin"}
    />
  );
}
