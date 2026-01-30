-- job_postingsテーブルの更新
-- 追加: graduation_year
-- 削除: requirements, employment_type, location, salary_min, salary_max

-- graduation_yearカラムを追加
ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS graduation_year INTEGER;

-- 不要なカラムを削除
ALTER TABLE job_postings DROP COLUMN IF EXISTS requirements;
ALTER TABLE job_postings DROP COLUMN IF EXISTS employment_type;
ALTER TABLE job_postings DROP COLUMN IF EXISTS location;
ALTER TABLE job_postings DROP COLUMN IF EXISTS salary_min;
ALTER TABLE job_postings DROP COLUMN IF EXISTS salary_max;

