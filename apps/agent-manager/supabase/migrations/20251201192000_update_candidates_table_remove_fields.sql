-- candidatesテーブルの更新
-- 削除: current_position, experience_years, skills, resume_url
-- notesカラムは残す（メモとして使用）

-- 不要なカラムを削除
ALTER TABLE candidates DROP COLUMN IF EXISTS current_position;
ALTER TABLE candidates DROP COLUMN IF EXISTS experience_years;
ALTER TABLE candidates DROP COLUMN IF EXISTS skills;
ALTER TABLE candidates DROP COLUMN IF EXISTS resume_url;


