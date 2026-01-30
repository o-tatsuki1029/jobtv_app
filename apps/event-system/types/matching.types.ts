// マイグレーション実行後に型定義が生成されるまで、手動で型を定義
export type MatchingSession = {
  id: string;
  event_id: string;
  session_count: number;
  company_weight: number;
  candidate_weight: number;
  special_interviews?: SpecialInterviewInput[] | null; // JSONB
  status: "pending" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};

export type MatchingSessionInsert = {
  event_id: string;
  session_count: number;
  company_weight: number;
  candidate_weight: number;
  special_interviews?: SpecialInterviewInput[] | null; // JSONB
  status?: "pending" | "completed" | "cancelled";
};

export type MatchingSessionUpdate = {
  event_id?: string;
  session_count?: number;
  company_weight?: number;
  candidate_weight?: number;
  status?: "pending" | "completed" | "cancelled";
};

export type MatchingResult = {
  id: string;
  matching_session_id: string;
  session_number: number;
  company_id: string;
  candidate_id: string;
  match_score: number | null;
  is_special_interview: boolean;
  created_at: string;
};

export type MatchingResultInsert = {
  matching_session_id: string;
  session_number: number;
  company_id: string;
  candidate_id: string;
  is_special_interview?: boolean;
  // match_scoreは保存しない（都度計算）
};

export type MatchingResultUpdate = {
  matching_session_id?: string;
  session_number?: number;
  company_id?: string;
  candidate_id?: string;
  match_score?: number | null;
  is_special_interview?: boolean;
};

export type SpecialInterview = {
  id: string;
  matching_session_id: string;
  company_id: string;
  candidate_id: string;
  session_number: number;
  created_at: string;
};

export type SpecialInterviewInsert = {
  matching_session_id: string;
  company_id: string;
  candidate_id: string;
  session_number: number;
};

export type SpecialInterviewUpdate = {
  matching_session_id?: string;
  company_id?: string;
  candidate_id?: string;
  session_number?: number;
};

export type MatchingWeights = {
  companyWeight: number;
  candidateWeight: number;
};

export type MatchScore = {
  companyId: string;
  candidateId: string;
  score: number;
  companyRating: number | null;
  candidateRating: number | null;
};

export type SpecialInterviewInput = {
  companyId: string;
  candidateId: string;
  sessionNumber: number;
};

// マッチング結果表示用の型
export type MatchingResultRow = {
  seatNumber: string;
  candidateName: string;
  candidateKana: string;
  companyName: string;
  matchScore: number | null;
  isSpecialInterview: boolean;
  candidateId?: string; // 評価ボタン用
  companyId?: string; // 評価ボタン用
  eventId?: string; // 評価ボタン用
  candidateRating?: number | null; // 学生評価（1-5）
  // 企業からの評価
  communicationRating?: number | null;
  cooperationRating?: number | null;
  creativeRating?: number | null;
  initiativeRating?: number | null;
  logicRating?: number | null;
  overallRating?: number | null;
  comment?: string | null;
};

export type CandidateResult = {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateKana: string;
  seatNumber: string | null;
  sessions: Array<{
    sessionNumber: number;
    companyId: string;
    companyName: string;
    matchScore: number | null;
    isSpecialInterview: boolean;
    candidateRating?: number | null; // 学生評価（1-5）
    // 企業からの評価
    communicationRating?: number | null;
    cooperationRating?: number | null;
    creativeRating?: number | null;
    initiativeRating?: number | null;
    logicRating?: number | null;
    overallRating?: number | null;
    comment?: string | null;
  }>;
};

// マッチングページ用の共通型
export type MatchingCompany = {
  id: string;
  name: string;
};

export type MatchingCandidate = {
  id: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  seat_number: string | null;
  email?: string;
};

export type EvaluationStatus = {
  companyCompleted: number;
  companyTotal: number;
  candidateCompleted: number;
  candidateTotal: number;
  candidates: Array<{
    id: string;
    name: string;
    seat_number: string | null;
    unratedCompanies: Array<{ id: string; name: string }>;
    ratedCompanies: Array<{ id: string; name: string }>;
  }>;
  companies: Array<{
    id: string;
    name: string;
    unratedCandidates: Array<{
      id: string;
      name: string;
      kana?: string;
      seat_number: string | null;
      school_name?: string | null;
    }>;
    ratedCandidates: Array<{
      id: string;
      name: string;
      kana?: string;
      seat_number: string | null;
      school_name?: string | null;
    }>;
  }>;
};

// マッチング結果データの型（useMatchingResultsで使用）
export type MatchingResultData = {
  id?: string;
  candidate_id: string;
  candidate_name?: string;
  candidate_kana?: string;
  seat_number?: string | null;
  session_number: number;
  company_id: string;
  name?: string;
  match_score: number | null;
  is_special_interview: boolean;
  candidate_rating?: number | null;
  // 企業からの評価
  communication_rating?: number | null;
  cooperation_rating?: number | null;
  creative_rating?: number | null;
  initiative_rating?: number | null;
  logic_rating?: number | null;
  overall_rating?: number | null;
  comment?: string | null;
  candidates: {
    last_name: string;
    first_name: string;
    last_name_kana: string;
    first_name_kana: string;
    seat_number?: string | null;
  } | null;
  companies: {
    name: string;
  } | null;
};
