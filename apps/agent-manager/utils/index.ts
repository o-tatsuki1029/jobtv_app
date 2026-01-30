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
export * from "./data";
export * from "./form";
export * from "./status";

