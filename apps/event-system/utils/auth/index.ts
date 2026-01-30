export type UserRole = "admin" | "recruiter" | "candidate";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "管理者",
  recruiter: "企業担当者",
  candidate: "学生",
} as const;

/**
 * ロールの日本語ラベルを取得
 */
export function getRoleLabel(
  role: UserRole | string | null | undefined
): string {
  if (!role) return "";
  return ROLE_LABELS[role as UserRole] || role;
}

/**
 * ロールに基づいてリダイレクト先を取得
 */
export function getRedirectPathByRole(
  role: UserRole | null | undefined
): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "recruiter":
      return "/recruiter";
    case "candidate":
      return "/candidate/rating";
    default:
      return "/login";
  }
}

export interface UserInfo {
  role: UserRole;
  userId: string;
  email: string | undefined;
  recruiterId?: string;
  companyId?: string;
  isAdmin: boolean;
}
