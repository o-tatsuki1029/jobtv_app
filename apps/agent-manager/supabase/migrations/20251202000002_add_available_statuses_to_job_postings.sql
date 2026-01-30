-- job_postingsテーブルにavailable_statusesカラムを追加
-- 各求人で使用可能な応募ステータス（フロー）を配列で保存

ALTER TABLE job_postings 
ADD COLUMN IF NOT EXISTS available_statuses application_status[] DEFAULT ARRAY['applied', 'document_screening', 'first_interview', 'second_interview', 'final_interview', 'offer', 'rejected', 'withdrawn']::application_status[];

-- 既存のレコードにはデフォルトの全ステータスを設定
UPDATE job_postings 
SET available_statuses = ARRAY['applied', 'document_screening', 'first_interview', 'second_interview', 'final_interview', 'offer', 'rejected', 'withdrawn']::application_status[]
WHERE available_statuses IS NULL;

-- NOT NULL制約を追加（デフォルト値があるので安全）
ALTER TABLE job_postings 
ALTER COLUMN available_statuses SET NOT NULL;







