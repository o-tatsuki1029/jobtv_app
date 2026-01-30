import RecruiterTemplatesPageClient from "./page-client";
import { getUserInfo } from "@/utils/auth/get-user-info";

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
