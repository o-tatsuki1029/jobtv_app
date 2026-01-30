import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Admin API用のクライアント（RLSをバイパス）
 * APIルートで使用するための共通ユーティリティ
 */
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  }

  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  // Service Role Keyの形式を簡易チェック（通常は`eyJ...`で始まるJWT）
  if (!supabaseServiceKey.startsWith('eyJ')) {
    console.warn("SUPABASE_SERVICE_ROLE_KEYの形式が正しくない可能性があります（通常は'eyJ'で始まるJWT形式です）");
  }

  const skipZeroTrustCheck =
    process.env.NODE_ENV === "development" &&
    process.env.SKIP_ZEROTRUST_CHECK === "true";

  if (skipZeroTrustCheck && process.env.NODE_TLS_REJECT_UNAUTHORIZED !== "0") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  }

  try {
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  } catch (error) {
    console.error("Admin Client作成エラー:", error);
    throw new Error(`Admin Clientの作成に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
  }
}

