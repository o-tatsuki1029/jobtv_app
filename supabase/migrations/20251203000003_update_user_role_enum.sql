-- user_role ENUM型を更新（admin、RA、CA、MRK）
-- 既存のrecruiterはRAに、company_userはCAにマッピング

-- まず、RLSポリシーを削除（後で再作成）
DROP POLICY IF EXISTS "Admin and recruiters can view all companies" ON companies;
DROP POLICY IF EXISTS "Admin and recruiters can insert companies" ON companies;
DROP POLICY IF EXISTS "Admin and recruiters can update companies" ON companies;
DROP POLICY IF EXISTS "Admin and recruiters can delete companies" ON companies;
DROP POLICY IF EXISTS "Admin and recruiters can view all job postings" ON job_postings;
DROP POLICY IF EXISTS "Admin and recruiters can insert job postings" ON job_postings;
DROP POLICY IF EXISTS "Admin and recruiters can update job postings" ON job_postings;
DROP POLICY IF EXISTS "Admin and recruiters can delete job postings" ON job_postings;
DROP POLICY IF EXISTS "Admin and recruiters can view all candidates" ON candidates;
DROP POLICY IF EXISTS "Admin and recruiters can insert candidates" ON candidates;
DROP POLICY IF EXISTS "Admin and recruiters can update candidates" ON candidates;
DROP POLICY IF EXISTS "Admin and recruiters can delete candidates" ON candidates;
DROP POLICY IF EXISTS "Admin and recruiters can view all applications" ON applications;
DROP POLICY IF EXISTS "Admin and recruiters can insert applications" ON applications;
DROP POLICY IF EXISTS "Admin and recruiters can update applications" ON applications;
DROP POLICY IF EXISTS "Admin and recruiters can delete applications" ON applications;
DROP POLICY IF EXISTS "Admin and recruiters can view all application progress" ON application_progress;
DROP POLICY IF EXISTS "Admin and recruiters can insert application progress" ON application_progress;
DROP POLICY IF EXISTS "Admin and recruiters can update application progress" ON application_progress;
DROP POLICY IF EXISTS "Admin and recruiters can delete application progress" ON application_progress;
DROP POLICY IF EXISTS "管理者とリクルーターは面談メモを閲覧可能" ON interview_notes;
DROP POLICY IF EXISTS "管理者とリクルーターは面談メモを作成可能" ON interview_notes;
DROP POLICY IF EXISTS "管理者とリクルーターは面談メモを更新可能" ON interview_notes;
DROP POLICY IF EXISTS "管理者とリクルーターは面談メモを削除可能" ON interview_notes;

-- 新しいENUM型を作成
CREATE TYPE user_role_new AS ENUM ('admin', 'RA', 'CA', 'MRK');

-- 既存データをマッピング
-- recruiter -> RA
-- company_user -> CA
-- admin -> admin
-- candidate -> そのまま（管理者管理ページでは表示しない）

-- デフォルト値を削除
ALTER TABLE profiles ALTER COLUMN role DROP DEFAULT;

-- 一時的にカラムの型を変更
ALTER TABLE profiles ALTER COLUMN role TYPE TEXT USING 
  CASE 
    WHEN role::text = 'recruiter' THEN 'RA'
    WHEN role::text = 'company_user' THEN 'CA'
    WHEN role::text = 'admin' THEN 'admin'
    ELSE role::text
  END;

-- 古いENUM型を削除
DROP TYPE IF EXISTS user_role;

-- 新しいENUM型に名前を変更
ALTER TYPE user_role_new RENAME TO user_role;

-- カラムの型を新しいENUM型に変更
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::user_role;

-- デフォルト値を再設定
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'admin'::user_role;

-- RLSポリシーを再作成（recruiter -> RA、company_user -> CAに変更）
-- companiesテーブル
CREATE POLICY "Admin and recruiters can view all companies"
  ON companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can insert companies"
  ON companies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can update companies"
  ON companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can delete companies"
  ON companies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

-- job_postingsテーブル
CREATE POLICY "Admin and recruiters can view all job postings"
  ON job_postings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can insert job postings"
  ON job_postings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can update job postings"
  ON job_postings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can delete job postings"
  ON job_postings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

-- candidatesテーブル
CREATE POLICY "Admin and recruiters can view all candidates"
  ON candidates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can insert candidates"
  ON candidates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can update candidates"
  ON candidates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can delete candidates"
  ON candidates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

-- applicationsテーブル
CREATE POLICY "Admin and recruiters can view all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can insert applications"
  ON applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can update applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can delete applications"
  ON applications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

-- application_progressテーブル
CREATE POLICY "Admin and recruiters can view all application progress"
  ON application_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can insert application progress"
  ON application_progress FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can update application progress"
  ON application_progress FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "Admin and recruiters can delete application progress"
  ON application_progress FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

-- interview_notesテーブル
CREATE POLICY "管理者とリクルーターは面談メモを閲覧可能"
  ON interview_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "管理者とリクルーターは面談メモを作成可能"
  ON interview_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
    AND created_by = auth.uid()
  );

CREATE POLICY "管理者とリクルーターは面談メモを更新可能"
  ON interview_notes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

CREATE POLICY "管理者とリクルーターは面談メモを削除可能"
  ON interview_notes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'RA')
    )
  );

-- company_user関連のポリシーも更新（CAに変更）
-- 注意: contact_person_emailカラムは削除されているため、CAロールのポリシーは一旦削除
-- 将来的に企業とユーザーの関連付けが必要になった場合は、別の方法で実装する
DROP POLICY IF EXISTS "Company users can view their company job postings" ON job_postings;
DROP POLICY IF EXISTS "Company users can view applications for their company jobs" ON applications;
DROP POLICY IF EXISTS "Company users can view progress for their company job applications" ON application_progress;

-- CAロールのポリシーは一旦作成しない（機能の出し分けはしないため）
-- 将来的に必要になった場合は、企業とユーザーの関連付けテーブルを作成して実装する

-- コメントを追加
COMMENT ON TYPE user_role IS 'ユーザーロール: admin（管理者）、RA（リクルーター）、CA（企業担当者）、MRK（マーケティング）';

