-- 人材紹介ビジネス進捗管理システム - データベーススキーマ

-- 1. ENUM型の定義
CREATE TYPE user_role AS ENUM ('admin', 'recruiter', 'candidate', 'company_user');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'closed');
CREATE TYPE application_status AS ENUM (
  'applied',
  'document_screening',
  'first_interview',
  'second_interview',
  'final_interview',
  'offer',
  'rejected',
  'withdrawn'
);

-- 2. profilesテーブルの拡張（roleカラム追加）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'candidate';

-- 3. companiesテーブル（企業）
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  contact_person_name TEXT,
  contact_person_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. job_postingsテーブル（求人）
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  employment_type TEXT NOT NULL,
  location TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  status job_status NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. candidatesテーブル（求職者）
CREATE TABLE candidates (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  skills TEXT[],
  experience_years INTEGER,
  current_position TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. applicationsテーブル（応募・登録）
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  current_status application_status NOT NULL DEFAULT 'applied',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(candidate_id, job_posting_id)
);

-- 7. application_progressテーブル（選考進捗履歴）
CREATE TABLE application_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status application_status NOT NULL,
  status_date DATE NOT NULL DEFAULT CURRENT_DATE,
  interview_date TIMESTAMPTZ,
  interview_location TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. インデックスの作成
CREATE INDEX idx_job_postings_company_id ON job_postings(company_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX idx_applications_job_posting_id ON applications(job_posting_id);
CREATE INDEX idx_applications_current_status ON applications(current_status);
CREATE INDEX idx_applications_recruiter_id ON applications(recruiter_id);
CREATE INDEX idx_application_progress_application_id ON application_progress(application_id);
CREATE INDEX idx_application_progress_status_date ON application_progress(status_date);

-- 9. updated_at自動更新のトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを設定
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON job_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Row Level Security (RLS) の有効化
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_progress ENABLE ROW LEVEL SECURITY;

-- 11. RLSポリシーの作成

-- companiesテーブルのポリシー
-- 管理者・リクルーター: 全データ閲覧・編集可能
CREATE POLICY "Admin and recruiters can view all companies"
  ON companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Admin and recruiters can insert companies"
  ON companies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Admin and recruiters can update companies"
  ON companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- job_postingsテーブルのポリシー
-- 管理者・リクルーター: 全データ閲覧・編集可能
-- 企業担当者: 自社の求人のみ閲覧可能
CREATE POLICY "Admin and recruiters can view all job postings"
  ON job_postings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Company users can view their company job postings"
  ON job_postings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_user'
      AND EXISTS (
        SELECT 1 FROM companies
        WHERE companies.id = job_postings.company_id
        AND companies.contact_person_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "Admin and recruiters can insert job postings"
  ON job_postings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Admin and recruiters can update job postings"
  ON job_postings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- candidatesテーブルのポリシー
-- 管理者・リクルーター: 全データ閲覧・編集可能
-- 求職者: 自分の情報のみ閲覧可能
CREATE POLICY "Admin and recruiters can view all candidates"
  ON candidates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Candidates can view their own data"
  ON candidates FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admin and recruiters can insert candidates"
  ON candidates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Admin and recruiters can update candidates"
  ON candidates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Candidates can update their own data"
  ON candidates FOR UPDATE
  USING (id = auth.uid());

-- applicationsテーブルのポリシー
-- 管理者・リクルーター: 全データ閲覧・編集可能
-- 求職者: 自分の応募情報のみ閲覧可能
-- 企業担当者: 自社の求人への応募情報のみ閲覧可能
CREATE POLICY "Admin and recruiters can view all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Candidates can view their own applications"
  ON applications FOR SELECT
  USING (candidate_id = auth.uid());

CREATE POLICY "Company users can view applications for their company jobs"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_user'
      AND EXISTS (
        SELECT 1 FROM job_postings
        JOIN companies ON companies.id = job_postings.company_id
        WHERE job_postings.id = applications.job_posting_id
        AND companies.contact_person_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "Admin and recruiters can insert applications"
  ON applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Candidates can insert their own applications"
  ON applications FOR INSERT
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "Admin and recruiters can update applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- application_progressテーブルのポリシー
-- 管理者・リクルーター: 全データ閲覧・編集可能
-- 求職者: 自分の応募の進捗のみ閲覧可能
-- 企業担当者: 自社の求人への応募進捗のみ閲覧可能
CREATE POLICY "Admin and recruiters can view all application progress"
  ON application_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Candidates can view their own application progress"
  ON application_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications
      WHERE applications.id = application_progress.application_id
      AND applications.candidate_id = auth.uid()
    )
  );

CREATE POLICY "Company users can view progress for their company job applications"
  ON application_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_user'
      AND EXISTS (
        SELECT 1 FROM applications
        JOIN job_postings ON job_postings.id = applications.job_posting_id
        JOIN companies ON companies.id = job_postings.company_id
        WHERE applications.id = application_progress.application_id
        AND companies.contact_person_email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "Admin and recruiters can insert application progress"
  ON application_progress FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Admin and recruiters can update application progress"
  ON application_progress FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

