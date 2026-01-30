/**
 * クライアントコンポーネントで使用可能な認証ユーティリティ
 * サーバー専用関数を含まないため、Client Componentから安全にインポート可能
 */

export type { UserRole, UserInfo } from "./types";
export { ROLE_LABELS } from "./types";
export { translateAuthError } from "./errors";
export { getRoleLabel, getRedirectPathByRole } from "./redirect";
