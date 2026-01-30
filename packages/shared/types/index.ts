/**
 * データベース型定義の再エクスポート
 * 共通のSupabase型定義を全アプリで使用できるようにする
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

// 拡張型を再エクスポート
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
  InterviewNote,
} from "./database-extensions";

