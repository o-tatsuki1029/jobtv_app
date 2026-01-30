-- application_progressとinterview_notesテーブルにupdated_atとupdated_byを追加

-- 1. application_progressテーブルにupdated_atとupdated_byを追加
ALTER TABLE application_progress
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. interview_notesテーブルにupdated_byを追加
ALTER TABLE interview_notes
ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 3. application_progressのupdated_at自動更新トリガーを設定
CREATE OR REPLACE FUNCTION update_application_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_application_progress_updated_at ON application_progress;
CREATE TRIGGER trigger_update_application_progress_updated_at
  BEFORE UPDATE ON application_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_application_progress_updated_at();

-- 4. interview_notesのupdated_at自動更新トリガーを設定（既存の可能性があるが念のため）
CREATE OR REPLACE FUNCTION update_interview_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_interview_notes_updated_at ON interview_notes;
CREATE TRIGGER trigger_update_interview_notes_updated_at
  BEFORE UPDATE ON interview_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_interview_notes_updated_at();

-- 5. 既存データのupdated_atをcreated_atで初期化
UPDATE application_progress
SET updated_at = created_at
WHERE updated_at IS NULL;







