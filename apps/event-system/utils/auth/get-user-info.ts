import { createClient } from "@/lib/supabase/server";
import { UserRole, UserInfo } from "./index";

/**
 * 認証済みユーザーの情報を取得（認証チェックは行わない）
 * レイアウトで既に認証チェック済みの場合に使用
 */
export async function getUserInfo(): Promise<UserInfo | null> {
  const supabase = await createClient();
  const { data: { user }, error: getUserError } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return null;
  }

  const { data: userProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role, company_id")
    .eq("id", user.id)
    .single();

  if (profileError || !userProfile) {
    return null;
  }

  const role = userProfile.role as UserRole;
  let recruiterId: string | undefined;
  let companyId: string | undefined;

  if (role === "recruiter") {
    recruiterId = user.id;
    companyId = userProfile.company_id || undefined;
  }

  return {
    role,
    userId: user.id,
    email: user.email,
    recruiterId,
    companyId,
    isAdmin: role === "admin",
  };
}

