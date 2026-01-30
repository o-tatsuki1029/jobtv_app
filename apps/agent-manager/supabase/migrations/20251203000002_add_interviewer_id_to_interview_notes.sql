-- interview_notesテーブルにinterviewer_idカラムを追加
-- 面談実施者を記録するため

ALTER TABLE interview_notes
ADD COLUMN IF NOT EXISTS interviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 既存データのinterviewer_idをcreated_byで初期化
UPDATE interview_notes
SET interviewer_id = created_by
WHERE interviewer_id IS NULL;

-- コメントを追加
COMMENT ON COLUMN interview_notes.interviewer_id IS '面談実施者のユーザーID（created_byとは別に記録）';


