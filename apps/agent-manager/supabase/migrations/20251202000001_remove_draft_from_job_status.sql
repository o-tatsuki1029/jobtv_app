-- job_status ENUM型からdraftを削除

-- 1. 既存のdraftステータスのレコードをactiveに変更
UPDATE job_postings SET status = 'active' WHERE status = 'draft';

-- 2. デフォルト値を削除
ALTER TABLE job_postings ALTER COLUMN status DROP DEFAULT;

-- 3. 新しいENUM型を作成（draftなし）
CREATE TYPE job_status_new AS ENUM ('active', 'closed');

-- 4. カラムの型を変更
ALTER TABLE job_postings 
  ALTER COLUMN status TYPE job_status_new 
  USING status::text::job_status_new;

-- 5. デフォルト値を再設定
ALTER TABLE job_postings ALTER COLUMN status SET DEFAULT 'active'::job_status_new;

-- 6. 古いENUM型を削除
DROP TYPE job_status;

-- 7. 新しいENUM型の名前を変更
ALTER TYPE job_status_new RENAME TO job_status;

