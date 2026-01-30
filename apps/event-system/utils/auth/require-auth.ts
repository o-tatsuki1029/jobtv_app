import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "./index";
import { getRedirectPathByRole } from "./index";
import { cookies } from "next/headers";

interface UserInfo {
  role: UserRole;
  userId: string;
  email: string | undefined;
  recruiterId?: string;
  companyId?: string;
}

async function getUserInfo(): Promise<UserInfo | null> {
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
  };
}

export async function requireAuth(): Promise<UserInfo> {
  const userInfo = await getUserInfo();
  if (!userInfo) {
    redirect("/login");
  }
  return userInfo;
}

export async function requireAdmin(): Promise<UserInfo> {
  const userInfo = await requireAuth();
  if (userInfo.role !== "admin") {
    redirect(getRedirectPathByRole(userInfo.role));
  }
  return userInfo;
}

export async function requireRecruiterOrAdmin(): Promise<UserInfo> {
  const userInfo = await requireAuth();
  if (userInfo.role !== "recruiter" && userInfo.role !== "admin") {
    redirect(getRedirectPathByRole(userInfo.role));
  }
  return userInfo;
}

export async function requireCandidate(): Promise<string> {
  const cookieStore = await cookies();
  const candidateId = cookieStore.get("candidate_id")?.value;

  if (!candidateId) {
    redirect("/candidate/login");
  }
  return candidateId;
}
