import { Database } from "@/types/database.types";
import { ROLE_LABELS as AUTH_ROLE_LABELS } from "@/utils/auth/index";

// users テーブルは profiles テーブルに統合されました
export type User = Database["public"]["Tables"]["profiles"]["Row"];

export const ROLE_LABELS = AUTH_ROLE_LABELS;

