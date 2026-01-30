/**
 * データベース型の統一エクスポート
 * 自動生成型と拡張型の両方をエクスポート
 */

// Supabaseの自動生成型を再エクスポート（共通パッケージから）
export type {
  Database,
  Tables,
  TablesInsert,
  TablesUpdate,
  Json,
  Enums,
  CompositeTypes,
} from "@jobtv-app/shared/types";

// 拡張型を再エクスポート（共通パッケージから）
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
} from "@jobtv-app/shared/types";
