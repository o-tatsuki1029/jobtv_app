import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function AdminLayoutAuth() {
  // Supabaseクライアントを使用して認証チェック
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return {
    sub: user.id,
    email: user.email || "",
  };
}
