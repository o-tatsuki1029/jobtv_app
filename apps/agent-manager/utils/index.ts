/**
 * ユーティリティ関数の統一エクスポート
 */

// Re-export cn function from shared package
export { cn } from "@jobtv-app/shared/utils/cn";

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 各ユーティリティモジュールを再エクスポート
export * from "./candidate";
// Note: ./data は Server Component 専用のため、直接インポートしてください
// export * from "./data"; // Server専用のため、utils/index.tsからは除外
export * from "./form";
export * from "./status";
