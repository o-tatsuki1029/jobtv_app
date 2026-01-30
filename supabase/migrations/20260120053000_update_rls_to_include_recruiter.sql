-- ============================================
-- 候補者データ等の権限に recruiter ロールを追加
-- ============================================

-- candidates テーブルのポリシー更新
DROP POLICY IF EXISTS "Admin and recruiters can view all candidates" ON candidates;
DROP POLICY IF EXISTS "Admin and recruiters can insert candidates" ON candidates;
DROP POLICY IF EXISTS "Admin and recruiters can update candidates" ON candidates;
DROP POLICY IF EXISTS "Admin and recruiters can delete candidates" ON candidates;

CREATE POLICY "Admin and recruiters can view all candidates"
  ON candidates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

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

CREATE POLICY "Admin and recruiters can delete candidates"
  ON candidates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- companies テーブルのポリシー更新
DROP POLICY IF EXISTS "Admin and recruiters can view all companies" ON companies;
DROP POLICY IF EXISTS "Admin and recruiters can insert companies" ON companies;
DROP POLICY IF EXISTS "Admin and recruiters can update companies" ON companies;
DROP POLICY IF EXISTS "Admin and recruiters can delete companies" ON companies;

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

CREATE POLICY "Admin and recruiters can delete companies"
  ON companies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- job_postings テーブルのポリシー更新
DROP POLICY IF EXISTS "Admin and recruiters can view all job postings" ON job_postings;
DROP POLICY IF EXISTS "Admin and recruiters can insert job postings" ON job_postings;
DROP POLICY IF EXISTS "Admin and recruiters can update job postings" ON job_postings;
DROP POLICY IF EXISTS "Admin and recruiters can delete job postings" ON job_postings;

CREATE POLICY "Admin and recruiters can view all job postings"
  ON job_postings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
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

CREATE POLICY "Admin and recruiters can delete job postings"
  ON job_postings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- applications テーブルのポリシー更新
DROP POLICY IF EXISTS "Admin and recruiters can view all applications" ON applications;
DROP POLICY IF EXISTS "Admin and recruiters can insert applications" ON applications;
DROP POLICY IF EXISTS "Admin and recruiters can update applications" ON applications;
DROP POLICY IF EXISTS "Admin and recruiters can delete applications" ON applications;

CREATE POLICY "Admin and recruiters can view all applications"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
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

CREATE POLICY "Admin and recruiters can update applications"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

CREATE POLICY "Admin and recruiters can delete applications"
  ON applications FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- application_progress テーブルのポリシー更新
DROP POLICY IF EXISTS "Admin and recruiters can view all application progress" ON application_progress;
DROP POLICY IF EXISTS "Admin and recruiters can insert application progress" ON application_progress;
DROP POLICY IF EXISTS "Admin and recruiters can update application progress" ON application_progress;
DROP POLICY IF EXISTS "Admin and recruiters can delete application progress" ON application_progress;

CREATE POLICY "Admin and recruiters can view all application progress"
  ON application_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
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

CREATE POLICY "Admin and recruiters can delete application progress"
  ON application_progress FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

