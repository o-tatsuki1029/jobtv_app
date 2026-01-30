import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  // 学生ログイン用のクッキーも削除
  const cookieStore = await cookies();
  cookieStore.delete("candidate_id");
  cookieStore.delete("candidate_event_id");

  return NextResponse.redirect(new URL("/login", request.url));
}


