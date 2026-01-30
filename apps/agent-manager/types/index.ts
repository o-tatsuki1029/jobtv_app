/**
 * データベース型の統一エクスポート
 * 自動生成型と拡張型の両方をエクスポート
 */

// Supabaseの自動生成型を再エクスポート
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Json,
  Enums,
  CompositeTypes,
} from "./database.types";

// 拡張型をエクスポート
export type {
  Profile,
  Candidate,
  Company,
  JobPosting,
  Application,
  ApplicationProgress,
  CAInterview,
  CandidateWithProfile,
  JobPostingWithCompany,
  ApplicationWithRelations,
  ProgressItemWithRelations,
  InterviewNoteWithRelations,
} from "./database-extensions";

// 後方互換性のためのエイリアス
export type { CAInterview as InterviewNote } from "./database-extensions";
