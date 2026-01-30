-- candidatesテーブルの更新
-- idをauth.usersへの参照から独立したUUIDに変更

-- 既存の外部キー制約を削除
ALTER TABLE candidates DROP CONSTRAINT IF EXISTS candidates_id_fkey;

-- idカラムをUUIDで自動生成するように変更
ALTER TABLE candidates ALTER COLUMN id DROP DEFAULT;
ALTER TABLE candidates ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- idがauth.usersを参照しないように変更（既に外部キーは削除済み）

