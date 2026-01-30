import RecruiterTemplatesPageClient from "./page-client";
import { getUserInfo } from "@jobtv-app/shared/auth";

export default async function RecruiterTemplatesPage() {
  // 認証チェックはレイアウトで実施済み
  const userInfo = await getUserInfo();

  return (
    <RecruiterTemplatesPageClient
      isAdmin={userInfo?.role === "admin"}
      initialCompanyId={userInfo?.companyId}
    />
  );
}
