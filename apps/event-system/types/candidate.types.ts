import { Database, TablesInsert } from "@/types/database.types";

// candidates テーブルの型定義
export type Candidate = Database["public"]["Tables"]["candidates"]["Row"];

type CandidateInsert = TablesInsert<"candidates">;
export type CandidateFormData = Omit<CandidateInsert, "id" | "created_at" | "updated_at" | "assigned_to" | "profile_id" | "full_name" | "notes">;

// 後方互換性のため、JobSeeker型もエクスポート（非推奨）
/** @deprecated Use Candidate instead */
export type JobSeeker = Candidate;
/** @deprecated Use CandidateFormData instead */
export type JobSeekerFormData = CandidateFormData;

