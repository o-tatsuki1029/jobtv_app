-- graduation_yearを必須にする
-- 既存のNULL値にはデフォルト値（例: 2025）を設定
UPDATE job_postings 
SET graduation_year = 2025
WHERE graduation_year IS NULL;

-- NOT NULL制約を追加
ALTER TABLE job_postings 
ALTER COLUMN graduation_year SET NOT NULL;


