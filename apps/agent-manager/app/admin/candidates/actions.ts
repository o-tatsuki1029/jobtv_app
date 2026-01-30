"use server";

import { createAdminClient } from "@jobtv-app/shared/supabase/admin";

export async function createCandidateUser(email: string) {
  const supabase = createAdminClient();

  // 管理者権限でユーザーを作成
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (authError) {
    return { error: authError, user: null };
  }

  return { error: null, user: authData.user };
}
