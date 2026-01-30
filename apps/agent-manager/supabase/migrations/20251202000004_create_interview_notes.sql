-- 面談メモテーブルを作成
-- 求職者（学生）に紐づく面談メモを保存

CREATE TABLE interview_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  interview_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLSポリシーを設定
ALTER TABLE interview_notes ENABLE ROW LEVEL SECURITY;

-- 管理者とリクルーターは全件閲覧可能
CREATE POLICY "管理者とリクルーターは面談メモを閲覧可能"
  ON interview_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- 管理者とリクルーターは面談メモを作成可能
CREATE POLICY "管理者とリクルーターは面談メモを作成可能"
  ON interview_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
    AND created_by = auth.uid()
  );

-- 管理者とリクルーターは面談メモを更新可能
CREATE POLICY "管理者とリクルーターは面談メモを更新可能"
  ON interview_notes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- 管理者とリクルーターは面談メモを削除可能
CREATE POLICY "管理者とリクルーターは面談メモを削除可能"
  ON interview_notes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'recruiter')
    )
  );

-- インデックスを追加
CREATE INDEX idx_interview_notes_candidate_id ON interview_notes(candidate_id);
CREATE INDEX idx_interview_notes_interview_date ON interview_notes(interview_date DESC);







