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
} from "./database-extensions";

// 共通ヘルパー型をエクスポート
export type {
  TableName,
  TableRow,
  TableInsert,
  TableUpdate,
  FormData,
  PaginationInfo,
  SortInfo,
  ApiResponse,
  User,
} from "./common-helpers";

// 後方互換性のためのエイリアス
export type { CAInterview as InterviewNote } from "./database-extensions";

